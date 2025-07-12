
import React from 'react';
import { Home, Building2, CheckSquare, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onMenuToggle: () => void;
}

const MobileNavigation = ({ currentPage, onPageChange, onMenuToggle }: MobileNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'colleges', label: 'Colleges', icon: Building2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={onMenuToggle}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-pt">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EduReach</h1>
              <p className="text-xs text-gray-500 capitalize">{currentPage}</p>
            </div>
          </div>
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
