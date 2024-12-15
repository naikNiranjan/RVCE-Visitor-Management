import React from 'react';
import { Navigation } from './app/navigation';
import { ThemeProvider } from './app/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
} 