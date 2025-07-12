
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Dashboard from './Dashboard';
import CollegeList from './CollegeList';
import TaskManagement from './TaskManagement';
import TeamManagement from './TeamManagement';
import AuthPage from './AuthPage';

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    // Simple demo authentication
    if (email === 'admin@foundarly.com' && password === 'password123') {
      setTimeout(() => {
        setIsAuthenticated(true);
        setAuthLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setAuthError('Invalid credentials. Please try admin@foundarly.com / password123');
        setAuthLoading(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLogin={handleLogin}
        error={authError}
        loading={authLoading}
      />
    );
  }

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
        onLogout={handleLogout}
      />
      
      {/* Mobile Navigation */}
      <MobileNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop content */}
        <div className="hidden lg:block flex-1 overflow-y-auto scrollbar-hide">
          <div className="animate-fade-in">
            {renderCurrentPage()}
          </div>
        </div>
        
        {/* Mobile content */}
        <div className="lg:hidden flex-1 overflow-y-auto scrollbar-hide">
          <div className="min-h-full animate-fade-in">
            {renderCurrentPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
