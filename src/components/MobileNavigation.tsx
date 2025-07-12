
import React from 'react';
import { Home, Building2, CheckSquare, Users, Menu } from 'lucide-react';

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
      {/* Mobile Bottom Navigation - Enhanced Design */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 safe-area-pb">
        <div className="grid grid-cols-5 h-20 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 rounded-xl mx-1 my-2 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 shadow-sm scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          <button
            onClick={onMenuToggle}
            className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl mx-1 my-2"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
