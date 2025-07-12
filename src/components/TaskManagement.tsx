
import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle, AlertTriangle, User, Filter } from 'lucide-react';

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tasks = [
    {
      id: 1,
      title: 'Site visit - Chennai Engineering College',
      description: 'Conduct campus visit and meet with Dean',
      college: 'Chennai Engineering College',
      assignee: 'John Doe',
      dueDate: '2024-03-12',
      priority: 'high',
      status: 'pending',
      type: 'visit'
    },
    {
      id: 2,
      title: 'Follow-up call - Mumbai Polytechnic',
      description: 'Discuss partnership terms and pricing',
      college: 'Mumbai Polytechnic',
      assignee: 'Jane Smith',
      dueDate: '2024-03-13',
      priority: 'medium',
      status: 'pending',
      type: 'call'
    },
    {
      id: 3,
      title: 'Submit proposal - Delhi Tech University',
      description: 'Send detailed proposal with curriculum outline',
      college: 'Delhi Tech University',
      assignee: 'Mike Johnson',
      dueDate: '2024-03-10',
      priority: 'high',
      status: 'completed',
      type: 'email'
    },
    {
      id: 4,
      title: 'Document review - Bangalore Institute',
      description: 'Review MoU draft and provide feedback',
      college: 'Bangalore Institute',
      assignee: 'Sarah Wilson',
      dueDate: '2024-03-15',
      priority: 'low',
      status: 'pending',
      type: 'admin'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === 'pending';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'overdue') return task.status === 'overdue';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
    { id: 'overdue', label: 'Overdue', count: tasks.filter(t => t.status === 'overdue').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks & Follow-ups</h1>
          <p className="text-gray-600 mt-1">Manage your outreach tasks and schedules</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 pt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(task.type)}`}>
                          {task.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {task.dueDate}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {task.assignee}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {task.college}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {task.status === 'pending' && (
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Mark Done
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'all' ? 'No tasks created yet' : `No ${activeTab} tasks`}
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
