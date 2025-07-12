
import React from 'react';
import MainApp from './components/MainApp';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <MainApp />
      <Toaster />
    </>
  );
}

export default App;
