
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Dashboard from './Dashboard';
import CollegeList from './CollegeList';
import TaskManagement from './TaskManagement';
import TeamManagement from './TeamManagement';

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'colleges':
        return <CollegeList />;
      case 'tasks':
        return <TaskManagement />;
      case 'team':
        return <TeamManagement />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Mobile Navigation */}
      <MobileNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop content - normal layout */}
        <div className="hidden lg:block flex-1 overflow-auto">
          {renderCurrentPage()}
        </div>
        
        {/* Mobile content - no top padding, just bottom padding for nav */}
        <div className="lg:hidden flex-1 overflow-auto">
          <div className="min-h-full">
            {renderCurrentPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
