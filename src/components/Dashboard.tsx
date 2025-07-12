
import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Calendar, TrendingUp, Plus, ArrowRight, Building2, Target, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsGrid from './StatsGrid';
import QuickActions from './QuickActions';
import MobileCard from './MobileCard';
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

      const colleges = collegesResponse.data || [];
      const tasks = tasksResponse.data || [];
      const team = teamResponse.data || [];

      setStats({
        totalColleges: colleges.length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        teamMembers: team.filter(t => t.status === 'active').length,
        activeColleges: colleges.filter(c => c.status === 'accepted').length
      });

      setRecentColleges(colleges.slice(0, 5));
      setUpcomingTasks(tasks.filter(t => t.status === 'pending').slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-college':
        onNavigate('colleges');
        break;
      case 'search':
      case 'filter':
        onNavigate('colleges');
        break;
      case 'schedule':
      case 'reports':
        onNavigate('tasks');
        break;
      case 'team':
        onNavigate('team');
        break;
      default:
        break;
    }
  };

  const handleStatClick = (index: number) => {
    const pages = ['colleges', 'colleges', 'tasks', 'team'];
    onNavigate(pages[index]);
  };

  const statsData = [
    {
      label: 'Total Colleges',
      value: stats.totalColleges,
      icon: Building2,
      color: 'bg-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      label: 'Active',
      value: stats.activeColleges,
      icon: Target,
      color: 'bg-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'bg-orange-600',
      trend: { value: 3, isPositive: false }
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'bg-purple-600',
      trend: { value: 5, isPositive: true }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 lg:p-6 space-y-4 lg:space-y-6">
      {/* Welcome Header */}
      <div className="space-y-3 lg:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Good morning! 👋</h1>
            <p className="text-gray-600 text-sm lg:text-base">Here's what's happening with your outreach today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onNavigate('colleges')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add College</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={statsData} onStatClick={handleStatClick} />
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Colleges */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Colleges</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('colleges')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 overflow-auto">
            {recentColleges.length > 0 ? (
              recentColleges.map((college) => (
                <MobileCard
                  key={college.id}
                  title={college.name}
                  location={`${college.city}, ${college.state}`}
                  status={college.status || 'pending'}
                  contact={{
                    person: college.contact_person || undefined,
                    phone: college.contact_phone || undefined,
                    email: college.contact_email || undefined,
                  }}
                  badges={college.college_type ? [college.college_type] : []}
                  onClick={() => onNavigate('colleges')}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No colleges added yet</p>
                <p className="text-sm text-gray-400 mb-4">Start by adding your first college</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('colleges')} className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50">
                  Add First College
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 overflow-auto">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <MobileCard
                  key={task.id}
                  title={task.title}
                  subtitle={task.description}
                  status={task.priority || 'medium'}
                  dates={{
                    nextFollowup: task.due_date || undefined,
                  }}
                  badges={[task.task_type || 'General']}
                  onClick={() => onNavigate('tasks')}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No pending tasks</p>
                <p className="text-sm text-gray-400 mb-4">All caught up! Great work.</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('tasks')} className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50">
                  Create Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights - Mobile Optimized */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-green-700 font-medium">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700 font-medium">This Week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">3.2</div>
              <div className="text-sm text-purple-700 font-medium">Avg Follow-ups</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-orange-700 font-medium">Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
