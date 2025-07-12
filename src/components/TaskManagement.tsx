
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertCircle, CheckCircle, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;
type College = Tables<'colleges'>;

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResponse, collegesResponse] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('colleges').select('*')
      ]);

      if (tasksResponse.data) setTasks(tasksResponse.data);
      if (collegesResponse.data) setColleges(collegesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getCollegeName = (collegeId: string | null) => {
    if (!collegeId) return 'General Task';
    const college = colleges.find(c => c.id === collegeId);
    return college?.name || 'Unknown College';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && tasks.find(t => t.due_date === dueDate)?.status !== 'completed';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCollegeName(task.college_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.due_date && isOverdue(t.due_date)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Task Management</h1>
            <p className="text-purple-100 text-lg">Stay organized and never miss a follow-up</p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{taskStats.completed} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>{taskStats.pending} Pending</span>
              </div>
              {taskStats.overdue > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{taskStats.overdue} Overdue</span>
                </div>
              )}
            </div>
          </div>
          <button className="flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{taskStats.total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{taskStats.pending}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{taskStats.completed}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{taskStats.overdue}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks, colleges, or descriptions..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority || 'medium')}`}>
                      {task.priority} priority
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status || 'pending')}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium">{getCollegeName(task.college_id)}</span>
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'pending')}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? "Try adjusting your search or filter criteria."
                : "Create your first task to get started with follow-up management."
              }
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium">
              Create First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
