
import React from 'react';
import MainApp from './components/MainApp';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <MainApp />
      <PWAInstallPrompt />
      <Toaster />
    </>
  );
}

export default App;
