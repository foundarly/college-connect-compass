
import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, Clock, TrendingUp, MapPin, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;
type Task = Tables<'tasks'>;

const Dashboard = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [collegesResponse, tasksResponse] = await Promise.all([
        supabase.from('colleges').select('*'),
        supabase.from('tasks').select('*').limit(5).order('created_at', { ascending: false })
      ]);

      if (collegesResponse.data) setColleges(collegesResponse.data);
      if (tasksResponse.data) setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: colleges.length,
    accepted: colleges.filter(c => c.status === 'accepted').length,
    pending: colleges.filter(c => c.status === 'pending').length,
    inDiscussion: colleges.filter(c => c.status === 'in-discussion').length,
  };

  const recentColleges = colleges.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to College CRM 👋
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl">
            Track your outreach progress, manage college relationships, and boost your success rate with our comprehensive CRM dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Add New College
            </button>
            <button className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 right-16 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Colleges</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">↗ 12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.accepted}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-emerald-600 text-sm font-medium">
              {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% success rate
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-amber-600 text-sm font-medium">Needs follow-up</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Discussion</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inDiscussion}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm font-medium">Active conversations</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Colleges */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Colleges</h2>
            <p className="text-gray-600 mt-1">Latest additions to your database</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentColleges.length > 0 ? (
              recentColleges.map((college) => (
                <div key={college.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{college.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{college.city}, {college.state}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {college.college_type}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        college.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                        college.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        college.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {college.status?.replace('-', ' ') || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No colleges added yet</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                  Add your first college
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
            <p className="text-gray-600 mt-1">Your latest follow-up activities</p>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex items-center text-gray-500 text-sm mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {task.priority} priority
                      </span>
                      <span className={`mt-2 px-2 py-1 text-xs rounded-full ${
                        task.status === 'completed' ? 'bg-green-50 text-green-700' :
                        task.status === 'overdue' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tasks created yet</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                  Create your first task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="bg-blue-50 p-3 rounded-lg mr-4">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Add College</p>
              <p className="text-sm text-gray-600">Register new institution</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="bg-green-50 p-3 rounded-lg mr-4">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Log Interaction</p>
              <p className="text-sm text-gray-600">Record meeting or call</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="bg-purple-50 p-3 rounded-lg mr-4">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Schedule Task</p>
              <p className="text-sm text-gray-600">Plan follow-up activity</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="bg-amber-50 p-3 rounded-lg mr-4">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View Reports</p>
              <p className="text-sm text-gray-600">Analyze performance</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
