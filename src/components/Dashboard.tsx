
import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Calendar, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;
type Task = Tables<'tasks'>;
type TeamMember = Tables<'team_members'>;

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalColleges: 0,
    pendingTasks: 0,
    teamMembers: 0,
    activeColleges: 0
  });
  const [recentColleges, setRecentColleges] = useState<College[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [collegesResponse, tasksResponse, teamResponse] = await Promise.all([
        supabase.from('colleges').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('team_members').select('*')
      ]);

      // Calculate stats
      const colleges = collegesResponse.data || [];
      const tasks = tasksResponse.data || [];
      const team = teamResponse.data || [];

      setStats({
        totalColleges: colleges.length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        teamMembers: team.filter(t => t.status === 'active').length,
        activeColleges: colleges.filter(c => c.status === 'accepted').length
      });

      // Recent colleges (last 5)
      setRecentColleges(colleges.slice(0, 5));

      // Upcoming tasks (next 5 pending)
      setUpcomingTasks(tasks.filter(t => t.status === 'pending').slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-discussion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onNavigate('colleges')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add College</span>
            </Button>
            <Button onClick={() => onNavigate('tasks')} variant="outline" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('colleges')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Colleges</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalColleges}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('colleges')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold text-green-600">{stats.activeColleges}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('tasks')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('team')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-xl font-bold text-purple-600">{stats.teamMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Colleges */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Colleges</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('colleges')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentColleges.length > 0 ? (
              recentColleges.map((college) => (
                <div key={college.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{college.name}</h4>
                    <p className="text-sm text-gray-600">{college.city}, {college.state}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(college.status || 'pending')}`}>
                    {college.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No colleges added yet</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => onNavigate('colleges')}>
                  Add First College
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority || 'medium')}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending tasks</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => onNavigate('tasks')}>
                  Create First Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => onNavigate('colleges')}>
              <Users className="w-6 h-6" />
              <span className="text-sm">Manage Colleges</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => onNavigate('tasks')}>
              <CheckSquare className="w-6 h-6" />
              <span className="text-sm">View Tasks</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => onNavigate('team')}>
              <Users className="w-6 h-6" />
              <span className="text-sm">Team Members</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => onNavigate('colleges')}>
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add College</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
