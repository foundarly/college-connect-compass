
import React from 'react';
import { Home, Users, CheckSquare, UserCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'colleges', label: 'Colleges', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">CRM Dashboard</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onToggle();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${currentPage === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
