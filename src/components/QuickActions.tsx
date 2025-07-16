
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Calendar, FileText, Users } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const actions = [
    { id: 'colleges', label: 'Add College', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'colleges', label: 'Search', icon: Search, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'colleges', label: 'Filter', icon: Filter, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'tasks', label: 'Tasks', icon: Calendar, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'dashboard', label: 'Reports', icon: FileText, color: 'bg-red-600 hover:bg-red-700' },
    { id: 'team', label: 'Team', icon: Users, color: 'bg-indigo-600 hover:bg-indigo-700' },
  ];

  const handleAction = (actionId: string) => {
    onNavigate(actionId);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Actions</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id + action.label}
                variant="outline"
                size="sm"
                onClick={() => handleAction(action.id)}
                className="h-20 flex-col gap-2 hover:shadow-lg transition-all duration-200 border-0 bg-white/80 hover:scale-105 active:scale-95"
              >
                <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
