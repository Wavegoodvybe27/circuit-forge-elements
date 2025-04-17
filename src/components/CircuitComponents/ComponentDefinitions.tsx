
import React from 'react';
import { CircuitComponent } from '@/types/circuitTypes';
import { formatComponentValue } from '@/utils/circuitUtils';

interface ComponentProps {
  component: CircuitComponent;
}

// Helper to transform components based on rotation
const getTransform = (component: CircuitComponent) => {
  const { position, rotation } = component;
  return `translate(${position.x}, ${position.y}) rotate(${rotation})`;
};

// Resistor Component
export const Resistor: React.FC<ComponentProps> = ({ component }) => {
  const formattedValue = formatComponentValue(component);
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <path 
        d="M-10,0 L-7,-5 L-3,5 L-1,-5 L3,5 L7,-5 L10,0" 
        fill="none" 
        strokeWidth="2" 
      />
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      <text x="0" y="-10" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
      <text x="0" y="20" textAnchor="middle" fontSize="8" fill="currentColor">
        {formattedValue}
      </text>
    </g>
  );
};

// Capacitor Component
export const Capacitor: React.FC<ComponentProps> = ({ component }) => {
  const formattedValue = formatComponentValue(component);
  const isACMode = component.properties.mode === 'AC';
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-5" y2="0" strokeWidth="2" />
      <line x1="-5" y1="-10" x2="-5" y2="10" strokeWidth="2" />
      <line x1="5" y1="-10" x2="5" y2="10" strokeWidth="2" />
      <line x1="5" y1="0" x2="20" y2="0" strokeWidth="2" />
      
      {/* Add curved lines for AC capacitors (polarized) */}
      {isACMode && (
        <path d="M 7,10 C 10,10 10,-10 7,-10" fill="none" strokeWidth="1" />
      )}
      
      <text x="0" y="-15" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
      <text x="0" y="20" textAnchor="middle" fontSize="8" fill="currentColor">
        {formattedValue}
      </text>
    </g>
  );
};

// Inductor Component
export const Inductor: React.FC<ComponentProps> = ({ component }) => {
  const formattedValue = formatComponentValue(component);
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-15" y2="0" strokeWidth="2" />
      <path 
        d="M-15,0 C-13,-5 -8,-5 -6,0 C-4,-5 1,-5 3,0 C5,-5 10,-5 12,0 C14,-5 19,-5 15,0" 
        fill="none" 
        strokeWidth="2" 
      />
      <line x1="15" y1="0" x2="20" y2="0" strokeWidth="2" />
      <text x="0" y="-10" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
      <text x="0" y="20" textAnchor="middle" fontSize="8" fill="currentColor">
        {formattedValue}
      </text>
    </g>
  );
};

// DC Voltage Source Component
export const VoltageSource: React.FC<ComponentProps> = ({ component }) => {
  const formattedValue = formatComponentValue(component);
  const isAC = component.properties.mode === 'AC';
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <circle cx="0" cy="0" r="10" fill="none" strokeWidth="2" />
      {isAC ? (
        // AC Voltage Source - sine wave
        <path 
          d="M-5,-2 C-3,2 -1,-6 1,2 C3,-2 5,2 5,0" 
          fill="none" 
          strokeWidth="1.5" 
          className="stroke-circuit-ac"
        />
      ) : (
        // DC Voltage Source - plus and minus
        <>
          <line x1="-4" y1="-2" x2="4" y2="-2" strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="0" y2="2" strokeWidth="1.5" />
          <line x1="-4" y1="6" x2="4" y2="6" strokeWidth="1.5" />
        </>
      )}
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      <text x="0" y="-15" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
      <text x="0" y="22" textAnchor="middle" fontSize="8" fill="currentColor">
        {formattedValue}
      </text>
    </g>
  );
};

// Current Source Component
export const CurrentSource: React.FC<ComponentProps> = ({ component }) => {
  const formattedValue = formatComponentValue(component);
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <circle cx="0" cy="0" r="10" fill="none" strokeWidth="2" />
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      <path d="M0,-7 L0,7 M0,7 L-3,4 M0,7 L3,4" fill="none" strokeWidth="1.5" />
      <text x="0" y="-15" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
      <text x="0" y="22" textAnchor="middle" fontSize="8" fill="currentColor">
        {formattedValue}
      </text>
    </g>
  );
};

// Ground Component
export const Ground: React.FC<ComponentProps> = ({ component }) => {
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="0" y1="-10" x2="0" y2="0" strokeWidth="2" />
      <line x1="-10" y1="0" x2="10" y2="0" strokeWidth="2" />
      <line x1="-6" y1="4" x2="6" y2="4" strokeWidth="2" />
      <line x1="-3" y1="8" x2="3" y2="8" strokeWidth="2" />
    </g>
  );
};

// Switch Component
export const Switch: React.FC<ComponentProps> = ({ component }) => {
  const isOpen = component.properties.isOpen || false;
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <circle cx="-10" cy="0" r="2" fill="currentColor" />
      <circle cx="10" cy="0" r="2" fill="currentColor" />
      {isOpen ? (
        <line x1="-8" y1="0" x2="5" y2="-8" strokeWidth="2" />
      ) : (
        <line x1="-8" y1="0" x2="8" y2="0" strokeWidth="2" />
      )}
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      <text x="0" y="-12" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
    </g>
  );
};

// Diode Component
export const Diode: React.FC<ComponentProps> = ({ component }) => {
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <line x1="-10" y1="-7" x2="-10" y2="7" strokeWidth="2" />
      <polygon 
        points="-10,0 10,7 10,-7" 
        fill={component.selected ? 'var(--circuit-selected)' : 'currentColor'}
        stroke="none"
      />
      <line x1="10" y1="-7" x2="10" y2="7" strokeWidth="2" />
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      <text x="0" y="-12" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
    </g>
  );
};

// LED Component
export const LED: React.FC<ComponentProps> = ({ component }) => {
  const color = component.properties.color || '#ff5555';
  
  return (
    <g transform={getTransform(component)} className={component.selected ? 'stroke-circuit-selected' : 'stroke-circuit-text'}>
      <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
      <line x1="-10" y1="-7" x2="-10" y2="7" strokeWidth="2" />
      <polygon 
        points="-10,0 10,7 10,-7" 
        fill={color}
        stroke="currentColor"
        strokeWidth="1"
      />
      <line x1="10" y1="-7" x2="10" y2="7" strokeWidth="2" />
      <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
      
      {/* Light rays */}
      <line x1="15" y1="-5" x2="18" y2="-8" strokeWidth="1" />
      <line x1="17" y1="0" x2="21" y2="0" strokeWidth="1" />
      <line x1="15" y1="5" x2="18" y2="8" strokeWidth="1" />
      
      <text x="0" y="-12" textAnchor="middle" fontSize="10" fill="currentColor">
        {component.label}
      </text>
    </g>
  );
};

// Wire Component
export const Wire: React.FC<{ wirePoints: { x: number; y: number }[], selected: boolean }> = ({ 
  wirePoints, selected 
}) => {
  if (!wirePoints.length) return null;
  
  const pathData = wirePoints.reduce((path, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    return `${path} L${point.x},${point.y}`;
  }, '');
  
  return (
    <path 
      d={pathData} 
      fill="none" 
      strokeWidth="2" 
      className={selected ? 'stroke-circuit-selected' : 'stroke-circuit-wire'} 
      strokeLinecap="round" 
    />
  );
};

// Component factory function
export const renderComponent = (component: CircuitComponent) => {
  switch (component.type) {
    case 'resistor':
      return <Resistor component={component} />;
    case 'capacitor':
      return <Capacitor component={component} />;
    case 'inductor':
      return <Inductor component={component} />;
    case 'voltageSource':
      return <VoltageSource component={component} />;
    case 'currentSource':
      return <CurrentSource component={component} />;
    case 'ground':
      return <Ground component={component} />;
    case 'switch':
      return <Switch component={component} />;
    case 'diode':
      return <Diode component={component} />;
    case 'led':
      return <LED component={component} />;
    default:
      return null;
  }
};
