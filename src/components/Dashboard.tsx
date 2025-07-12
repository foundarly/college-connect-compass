
import React from 'react';
import { Building2, Users, Calendar, TrendingUp, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Colleges',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
      color: 'blue'
    },
    {
      name: 'Accepted',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Pending',
      value: '134',
      change: '-2%',
      changeType: 'negative',
      icon: Clock,
      color: 'yellow'
    },
    {
      name: 'Follow-ups Due',
      value: '23',
      change: '+5',
      changeType: 'neutral',
      icon: Calendar,
      color: 'red'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      college: 'MIT Engineering College',
      action: 'Site visit completed',
      date: '2 hours ago',
      status: 'success',
      icon: MapPin
    },
    {
      id: 2,
      college: 'Delhi Technical University',
      action: 'Follow-up call scheduled',
      date: '4 hours ago',
      status: 'pending',
      icon: Phone
    },
    {
      id: 3,
      college: 'Mumbai Polytechnic',
      action: 'Email sent with proposal',
      date: '1 day ago',
      status: 'neutral',
      icon: Mail
    },
    {
      id: 4,
      college: 'Bangalore Degree College',
      action: 'Rejected - Budget constraints',
      date: '2 days ago',
      status: 'error',
      icon: XCircle
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Site visit - Chennai Engineering',
      date: 'Today, 2:00 PM',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Follow-up call - Hyderabad Tech',
      date: 'Tomorrow, 10:00 AM',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Submit proposal - Pune University',
      date: 'Mar 15, 2024',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your outreach.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.college}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{task.date}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
            <Building2 className="w-5 h-5 mr-2" />
            Add New College
          </button>
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Follow-up
          </button>
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
