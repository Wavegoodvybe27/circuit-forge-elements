
import React from 'react';
import { useCircuit } from '@/context/CircuitContext';
import { ComponentType } from '@/types/circuitTypes';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface ComponentButtonProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const ComponentButton: React.FC<ComponentButtonProps> = ({ type, label, icon }) => {
  const { state, addComponent } = useCircuit();

  const handleClick = () => {
    // Add a component at the center of the canvas initially
    // It will be moved when dragged
    addComponent(type, { x: 400, y: 300 });
  };

  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center justify-center gap-1 p-2 h-auto"
      onClick={handleClick}
    >
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <span className="text-xs">{label}</span>
    </Button>
  );
};

export const ComponentSidebar: React.FC = () => {
  const { state, setMode, toggleSnap, setGridSize } = useCircuit();

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold">Circuit Forge</h2>
        <p className="text-sm text-gray-500">Design electronic circuits</p>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Label htmlFor="mode-switch">Mode:</Label>
          <div className="flex-1 flex justify-between items-center">
            <span className={`text-sm ${state.mode === 'DC' ? 'text-circuit-dc font-bold' : 'text-gray-400'}`}>
              DC
            </span>
            <Switch
              id="mode-switch"
              checked={state.mode === 'AC'}
              onCheckedChange={(checked) => setMode(checked ? 'AC' : 'DC')}
            />
            <span className={`text-sm ${state.mode === 'AC' ? 'text-circuit-ac font-bold' : 'text-gray-400'}`}>
              AC
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Label htmlFor="snap-toggle">Snap to grid:</Label>
          <Switch
            id="snap-toggle"
            checked={state.snap}
            onCheckedChange={toggleSnap}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grid-size">Grid Size: {state.gridSize}px</Label>
          <Slider
            id="grid-size"
            min={5}
            max={40}
            step={5}
            value={[state.gridSize]}
            onValueChange={(vals) => setGridSize(vals[0])}
            className="w-full"
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic">
          <AccordionTrigger className="px-4 py-2">Basic Components</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-1 p-1">
              <ComponentButton 
                type="resistor" 
                label="Resistor" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <path 
                      d="M-10,0 L-7,-5 L-3,5 L-1,-5 L3,5 L7,-5 L10,0" 
                      fill="none" 
                      strokeWidth="2" 
                    />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="capacitor" 
                label="Capacitor" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-5" y2="0" strokeWidth="2" />
                    <line x1="-5" y1="-10" x2="-5" y2="10" strokeWidth="2" />
                    <line x1="5" y1="-10" x2="5" y2="10" strokeWidth="2" />
                    <line x1="5" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="inductor" 
                label="Inductor" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-15" y2="0" strokeWidth="2" />
                    <path 
                      d="M-15,0 C-13,-5 -8,-5 -6,0 C-4,-5 1,-5 3,0 C5,-5 10,-5 12,0 C14,-5 19,-5 15,0" 
                      fill="none" 
                      strokeWidth="2" 
                    />
                    <line x1="15" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger className="px-4 py-2">Sources</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-1 p-1">
              <ComponentButton 
                type="voltageSource" 
                label="Voltage" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <circle cx="0" cy="0" r="10" fill="none" strokeWidth="2" />
                    <line x1="-4" y1="-2" x2="4" y2="-2" strokeWidth="1.5" />
                    <line x1="0" y1="-6" x2="0" y2="2" strokeWidth="1.5" />
                    <line x1="-4" y1="6" x2="4" y2="6" strokeWidth="1.5" />
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="currentSource" 
                label="Current" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <circle cx="0" cy="0" r="10" fill="none" strokeWidth="2" />
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                    <path d="M0,-7 L0,7 M0,7 L-3,4 M0,7 L3,4" fill="none" strokeWidth="1.5" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="ground" 
                label="Ground" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="0" y1="-10" x2="0" y2="0" strokeWidth="2" />
                    <line x1="-10" y1="0" x2="10" y2="0" strokeWidth="2" />
                    <line x1="-6" y1="4" x2="6" y2="4" strokeWidth="2" />
                    <line x1="-3" y1="8" x2="3" y2="8" strokeWidth="2" />
                  </svg>
                } 
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extras">
          <AccordionTrigger className="px-4 py-2">Additional</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-1 p-1">
              <ComponentButton 
                type="switch" 
                label="Switch" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <circle cx="-10" cy="0" r="2" fill="currentColor" />
                    <circle cx="10" cy="0" r="2" fill="currentColor" />
                    <line x1="-8" y1="0" x2="5" y2="-8" strokeWidth="2" />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="diode" 
                label="Diode" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <line x1="-10" y1="-7" x2="-10" y2="7" strokeWidth="2" />
                    <polygon 
                      points="-10,0 10,7 10,-7" 
                      fill="currentColor"
                      stroke="none"
                    />
                    <line x1="10" y1="-7" x2="10" y2="7" strokeWidth="2" />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                  </svg>
                } 
              />
              <ComponentButton 
                type="led" 
                label="LED" 
                icon={
                  <svg viewBox="-20 -10 40 20" width="24" height="24" className="stroke-current">
                    <line x1="-20" y1="0" x2="-10" y2="0" strokeWidth="2" />
                    <line x1="-10" y1="-7" x2="-10" y2="7" strokeWidth="2" />
                    <polygon 
                      points="-10,0 10,7 10,-7" 
                      fill="#ff5555"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <line x1="10" y1="-7" x2="10" y2="7" strokeWidth="2" />
                    <line x1="10" y1="0" x2="20" y2="0" strokeWidth="2" />
                    <line x1="15" y1="-5" x2="18" y2="-8" strokeWidth="1" />
                    <line x1="17" y1="0" x2="21" y2="0" strokeWidth="1" />
                    <line x1="15" y1="5" x2="18" y2="8" strokeWidth="1" />
                  </svg>
                } 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-auto p-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Circuit Forge Elements v1.0</p>
      </div>
    </div>
  );
};

export default ComponentSidebar;
