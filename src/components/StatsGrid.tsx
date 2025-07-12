
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsGridProps {
  stats: StatItem[];
  onStatClick?: (index: number) => void;
}

const StatsGrid = ({ stats, onStatClick }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm ${
              onStatClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
            }`}
            onClick={() => onStatClick?.(index)}
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
                    {stat.trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
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
