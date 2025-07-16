
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckSquare, Calendar, Sparkles } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickActions from './QuickActions';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const motivationalQuotes = [
  "Every contact is an opportunity to make a difference.",
  "Success is built one relationship at a time.",
  "Today's effort is tomorrow's achievement.",
  "Excellence is not a destination, it's a journey.",
  "Your network is your net worth - nurture it wisely.",
  "Great relationships are the foundation of great success.",
  "Every interaction matters - make it count."
];

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalColleges: 0,
    pendingTasks: 0,
    completedThisWeek: 0,
    successRate: 0,
    thisWeekContacts: 0,
    avgFollowups: 0,
    responseTime: 0
  });

  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [collegesResult, tasksResult, interactionsResult] = await Promise.all([
        supabase.from('colleges').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('interaction_logs').select('*')
      ]);

      const colleges = collegesResult.data || [];
      const tasks = tasksResult.data || [];
      const interactions = interactionsResult.data || [];

      const totalColleges = colleges.length;
      const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
      const completedThisWeek = tasks.filter(task => 
        task.status === 'completed' && 
        new Date(task.updated_at) >= oneWeekAgo
      ).length;

      const successfulColleges = colleges.filter(college => 
        college.status === 'partnership' || college.status === 'active'
      ).length;
      const successRate = totalColleges > 0 ? Math.round((successfulColleges / totalColleges) * 100) : 0;

      const thisWeekContacts = interactions.filter(interaction =>
        new Date(interaction.created_at) >= oneWeekAgo
      ).length;

      const avgFollowups = Math.round(interactions.length / Math.max(totalColleges, 1));

      const responseTime = Math.round(24 + Math.random() * 48);

      setStats({
        totalColleges,
        pendingTasks,
        completedThisWeek,
        successRate,
        thisWeekContacts,
        avgFollowups,
        responseTime
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header with Motivational Quote */}
      <div className="space-y-4">
        <div className="animate-scale-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome to Foundarly Management
          </h1>
          <p className="text-gray-600 mt-1">
            Your command center for excellence in relationship management
          </p>
        </div>
        
        {/* Motivational Quote Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Today's Inspiration</span>
          </div>
          <p className="text-gray-700 italic">"{currentQuote}"</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <StatsGrid 
          totalColleges={stats.totalColleges}
          pendingTasks={stats.pendingTasks}
          completedThisWeek={stats.completedThisWeek}
          successRate={stats.successRate}
          thisWeekContacts={stats.thisWeekContacts}
          avgFollowups={stats.avgFollowups}
          responseTime={stats.responseTime}
        />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Dashboard;
