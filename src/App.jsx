import React from 'react';
import { ErrorBoundaryProvider } from './providers/ErrorBoundary';
import { TaskProvider } from './providers/TaskProvider';
import { TooltipProvider } from './components/ui/tooltip';
import EnhancedOrbitalMap from './components/EnhancedOrbitalMap';

export default function App() {
  return (
    <ErrorBoundaryProvider>
      <TooltipProvider>
        <div className="dark h-screen">
          <TaskProvider>
            <EnhancedOrbitalMap />
          </TaskProvider>
        </div>
      </TooltipProvider>
    </ErrorBoundaryProvider>
  );
}