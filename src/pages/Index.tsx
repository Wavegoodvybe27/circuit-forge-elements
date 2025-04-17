
import React from 'react';
import { CircuitProvider } from '@/context/CircuitContext';
import ComponentSidebar from '@/components/ComponentSidebar';
import { CircuitCanvas } from '@/components/CircuitCanvas';
import { InspectorPanel } from '@/components/InspectorPanel';

const CircuitForge = () => {
  return (
    <CircuitProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <ComponentSidebar />
        <CircuitCanvas />
        <InspectorPanel />
      </div>
    </CircuitProvider>
  );
};

export default CircuitForge;
