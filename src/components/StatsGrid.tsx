
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, CheckSquare, Calendar, Phone, Clock, Target } from 'lucide-react';

interface StatsGridProps {
  totalColleges: number;
  pendingTasks: number;
  completedThisWeek: number;
  successRate: number;
  thisWeekContacts: number;
  avgFollowups: number;
  responseTime: number;
}

const StatsGrid = ({ 
  totalColleges, 
  pendingTasks, 
  completedThisWeek, 
  successRate, 
  thisWeekContacts, 
  avgFollowups, 
  responseTime 
}: StatsGridProps) => {
  const stats = [
    {
      label: 'Total Colleges',
      value: totalColleges,
      icon: Users,
      color: 'bg-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: CheckSquare,
      color: 'bg-orange-600',
      trend: { value: 5, isPositive: false }
    },
    {
      label: 'Completed This Week',
      value: completedThisWeek,
      icon: Calendar,
      color: 'bg-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: Target,
      color: 'bg-purple-600',
      trend: { value: 3, isPositive: true }
    },
    {
      label: 'This Week Contacts',
      value: thisWeekContacts,
      icon: Phone,
      color: 'bg-indigo-600',
      trend: { value: 15, isPositive: true }
    },
    {
      label: 'Avg Follow-ups',
      value: avgFollowups,
      icon: TrendingUp,
      color: 'bg-pink-600',
      trend: { value: 2, isPositive: true }
    },
    {
      label: 'Response Time',
      value: `${responseTime}h`,
      icon: Clock,
      color: 'bg-cyan-600',
      trend: { value: 10, isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend.isPositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${stat.trend.isPositive ? '' : 'rotate-180'}`} />
                    <span>{stat.trend.value}%</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
