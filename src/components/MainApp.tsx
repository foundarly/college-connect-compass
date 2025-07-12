
import React, { useState, useEffect } from 'react';
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
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const authData = localStorage.getItem('foundarly_auth');
      const authTimestamp = localStorage.getItem('foundarly_auth_timestamp');
      
      if (authData && authTimestamp) {
        const now = Date.now();
        const authTime = parseInt(authTimestamp);
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        
        // Check if auth is still valid (within 7 days)
        if (now - authTime < oneWeek) {
          setIsAuthenticated(true);
        } else {
          // Auth expired, clear storage
          localStorage.removeItem('foundarly_auth');
          localStorage.removeItem('foundarly_auth_timestamp');
        }
      }
      setAuthLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    // Simple demo authentication with persistence
    if (email === 'admin@foundarly.com' && password === 'password123') {
      setTimeout(() => {
        const authData = {
          email,
          loginTime: Date.now()
        };
        
        // Store auth data and timestamp
        localStorage.setItem('foundarly_auth', JSON.stringify(authData));
        localStorage.setItem('foundarly_auth_timestamp', Date.now().toString());
        
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
    // Clear auth data from localStorage
    localStorage.removeItem('foundarly_auth');
    localStorage.removeItem('foundarly_auth_timestamp');
    
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSidebarOpen(false);
  };

  // Show loading spinner while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        <div className="lg:hidden flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="min-h-full animate-fade-in">
            {renderCurrentPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
