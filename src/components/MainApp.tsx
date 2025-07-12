
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Dashboard from './Dashboard';
import CollegeList from './CollegeList';
import TaskManagement from './TaskManagement';
import TeamManagement from './TeamManagement';
import AuthPage from './AuthPage';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  if (!user || !session) {
    return <AuthPage />;
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
