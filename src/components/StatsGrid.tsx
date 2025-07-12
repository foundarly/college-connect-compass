
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`hover:shadow-md transition-all duration-200 ${onStatClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
            onClick={() => onStatClick?.(index)}
          >
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className={`p-2 rounded-lg ${stat.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm text-gray-600 truncate">{stat.label}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg lg:text-xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend && (
                      <span className={`text-xs font-medium ${
                        stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
