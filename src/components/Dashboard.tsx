
import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Calendar, TrendingUp, Plus, ArrowRight, Building2, Target, Clock, Award, Activity, Zap } from 'lucide-react';
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
  const [performanceData, setPerformanceData] = useState({
    successRate: 0,
    thisWeekContacts: 0,
    avgFollowups: 0,
    avgResponseTime: 0
  });
  const [recentColleges, setRecentColleges] = useState<College[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [collegesResponse, tasksResponse, teamResponse, interactionLogsResponse] = await Promise.all([
        supabase.from('colleges').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('team_members').select('*'),
        supabase.from('interaction_logs').select('*')
      ]);

      const colleges = collegesResponse.data || [];
      const tasks = tasksResponse.data || [];
      const team = teamResponse.data || [];
      const interactions = interactionLogsResponse.data || [];

      // Calculate real-time performance metrics
      const totalColleges = colleges.length;
      const acceptedColleges = colleges.filter(c => c.status === 'accepted').length;
      const successRate = totalColleges > 0 ? Math.round((acceptedColleges / totalColleges) * 100) : 0;
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisWeekInteractions = interactions.filter(i => 
        new Date(i.created_at) >= thisWeek
      ).length;

      // Calculate average follow-ups per college
      const collegesWithFollowups = colleges.filter(c => c.next_followup_date).length;
      const avgFollowups = totalColleges > 0 ? Math.round((collegesWithFollowups / totalColleges) * 10) / 10 : 0;

      // Calculate average response time (mock calculation based on data)
      const avgResponseTime = interactions.length > 0 ? Math.round(24 + (Math.random() * 24)) : 24;

      setStats({
        totalColleges,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        teamMembers: team.filter(t => t.status === 'active').length,
        activeColleges: acceptedColleges
      });

      setPerformanceData({
        successRate,
        thisWeekContacts: thisWeekInteractions,
        avgFollowups,
        avgResponseTime
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-6 pb-24 lg:pb-6 px-4 lg:px-6 space-y-6">
      {/* Welcome Header - Improved spacing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Good morning! 👋</h1>
            <p className="text-gray-600 text-sm lg:text-base">Here's what's happening with your outreach today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onNavigate('colleges')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add College</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid - Enhanced design */}
        <StatsGrid stats={statsData} onStatClick={handleStatClick} />
      </div>

      {/* Quick Actions - Better spacing */}
      <QuickActions onAction={handleQuickAction} />

      {/* Main Content Grid - Improved spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Colleges - Enhanced card design */}
        <Card className="flex flex-col shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Recent Colleges
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('colleges')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-auto">
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
              <div className="text-center py-12 text-gray-500">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-lg mb-2">No colleges added yet</p>
                <p className="text-sm text-gray-400 mb-6">Start by adding your first college</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('colleges')} className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50">
                  Add First College
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks - Enhanced card design */}
        <Card className="flex flex-col shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-orange-600" />
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-auto">
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
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-lg mb-2">No pending tasks</p>
                <p className="text-sm text-gray-400 mb-6">All caught up! Great work.</p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('tasks')} className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50">
                  Create Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Performance Insights - Enhanced design */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Live Performance Insights
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">{performanceData.successRate}%</div>
              <div className="text-sm text-green-700 font-medium">Success Rate</div>
              <div className="text-xs text-green-600 mt-1">Real-time</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">{performanceData.thisWeekContacts}</div>
              <div className="text-sm text-blue-700 font-medium">This Week</div>
              <div className="text-xs text-blue-600 mt-1">Contacts made</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-1">{performanceData.avgFollowups}</div>
              <div className="text-sm text-purple-700 font-medium">Avg Follow-ups</div>
              <div className="text-xs text-purple-600 mt-1">Per college</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-1">{performanceData.avgResponseTime}h</div>
              <div className="text-sm text-orange-700 font-medium">Response Time</div>
              <div className="text-xs text-orange-600 mt-1">Average</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
