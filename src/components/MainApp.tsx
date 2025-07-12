
import React, { useState } from 'react';
import Sidebar from './Sidebar';
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-auto">
        <div className="pt-16 lg:pt-0">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
