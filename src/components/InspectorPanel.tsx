
import React, { useEffect, useState } from 'react';
import { useCircuit } from '@/context/CircuitContext';
import { CircuitComponent } from '@/types/circuitTypes';
import { formatComponentValue } from '@/utils/circuitUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export const InspectorPanel: React.FC = () => {
  const { state, updateComponent, removeComponent } = useCircuit();
  const [componentValue, setComponentValue] = useState<string>('');
  const [componentLabel, setComponentLabel] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [switchOpen, setSwitchOpen] = useState<boolean>(false);
  const [ledColor, setLedColor] = useState<string>('#ff5555');

  const selectedComponent = state.components.find(c => c.id === state.selectedComponentId);

  useEffect(() => {
    if (selectedComponent) {
      setComponentValue(selectedComponent.value.toString());
      setComponentLabel(selectedComponent.label);
      setRotation(selectedComponent.rotation);
      setSwitchOpen(selectedComponent.properties.isOpen || false);
      setLedColor(selectedComponent.properties.color || '#ff5555');
    }
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="w-64 h-full bg-white border-l border-gray-200 p-4">
        <p className="text-gray-500 text-sm">Select a component to edit its properties</p>
      </div>
    );
  }

  const handleValueChange = (value: string) => {
    setComponentValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateComponent(selectedComponent.id, { value: numValue });
    }
  };

  const handleLabelChange = (label: string) => {
    setComponentLabel(label);
    updateComponent(selectedComponent.id, { label });
  };

  const handleRotationChange = (degrees: number) => {
    setRotation(degrees);
    updateComponent(selectedComponent.id, { rotation: degrees });
  };

  const handleSwitchToggle = (isOpen: boolean) => {
    setSwitchOpen(isOpen);
    updateComponent(selectedComponent.id, {
      properties: { ...selectedComponent.properties, isOpen }
    });
  };

  const handleLedColorChange = (color: string) => {
    setLedColor(color);
    updateComponent(selectedComponent.id, {
      properties: { ...selectedComponent.properties, color }
    });
  };

  return (
    <div className="w-64 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-sm">Component Properties</h3>
        <Button variant="ghost" size="sm" className="p-0 h-auto w-auto">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-grow">
        <div>
          <Label className="mb-1 block">Type</Label>
          <div className="font-medium capitalize">
            {formatComponentType(selectedComponent.type)}
          </div>
        </div>

        <div>
          <Label htmlFor="label" className="mb-1 block">Label</Label>
          <Input
            id="label"
            value={componentLabel}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>

        {['resistor', 'capacitor', 'inductor', 'voltageSource', 'currentSource'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="value" className="mb-1 block">Value</Label>
            <div className="flex items-center gap-2">
              <Input
                id="value"
                value={componentValue}
                onChange={(e) => handleValueChange(e.target.value)}
                type="number"
                step={getStepForComponent(selectedComponent)}
              />
              <div className="text-sm text-gray-500 min-w-16">
                {formatComponentValue(selectedComponent)}
              </div>
            </div>
          </div>
        )}

        {selectedComponent.type === 'switch' && (
          <div className="space-y-1">
            <Label htmlFor="switch-state">Switch State</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Closed</span>
              <Switch
                id="switch-state"
                checked={switchOpen}
                onCheckedChange={handleSwitchToggle}
              />
              <span className="text-sm text-gray-500">Open</span>
            </div>
          </div>
        )}

        {selectedComponent.type === 'led' && (
          <div className="space-y-1">
            <Label htmlFor="led-color">LED Color</Label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                id="led-color" 
                value={ledColor} 
                onChange={(e) => handleLedColorChange(e.target.value)}
                className="w-8 h-8 cursor-pointer border-0"
              />
              <Input
                value={ledColor}
                onChange={(e) => handleLedColorChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="rotation">Rotation: {rotation}°</Label>
          <div className="flex items-center gap-2">
            <Slider
              id="rotation"
              min={0}
              max={270}
              step={90}
              value={[rotation]}
              onValueChange={(vals) => handleRotationChange(vals[0])}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleRotationChange((rotation + 90) % 360)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => removeComponent(selectedComponent.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Component
        </Button>
      </div>
    </div>
  );
};

// Helper functions
function formatComponentType(type: string): string {
  const formatMap: Record<string, string> = {
    'resistor': 'Resistor',
    'capacitor': 'Capacitor',
    'inductor': 'Inductor',
    'voltageSource': 'Voltage Source',
    'currentSource': 'Current Source',
    'ground': 'Ground',
    'switch': 'Switch',
    'diode': 'Diode',
    'led': 'LED'
  };
  
  return formatMap[type] || type;
}

function getStepForComponent(component: CircuitComponent): number {
  switch (component.type) {
    case 'resistor':
      return 100; // 100 ohm steps
    case 'capacitor':
      return 0.000001; // 1µF steps
    case 'inductor':
      return 0.001; // 1mH steps
    case 'voltageSource':
      return 0.1; // 0.1V steps
    case 'currentSource':
      return 0.001; // 1mA steps
    default:
      return 1;
  }
}

export default InspectorPanel;
