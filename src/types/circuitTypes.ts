
// Circuit component types
export type ComponentType = 
  | 'resistor' 
  | 'capacitor' 
  | 'inductor' 
  | 'voltageSource' 
  | 'currentSource'
  | 'ground'
  | 'wire'
  | 'switch'
  | 'diode'
  | 'led';

export type CircuitMode = 'AC' | 'DC';

export interface Position {
  x: number;
  y: number;
}

export interface ComponentNode {
  id: string;
  position: Position;
}

export interface Connection {
  from: string;
  to: string;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: Position;
  rotation: number; // 0, 90, 180, 270 degrees
  value: number;
  label: string;
  nodes: ComponentNode[];
  selected: boolean;
  properties: Record<string, any>;
}

export interface Wire {
  id: string;
  from: string; // Component node ID
  to: string;   // Component node ID
  points: Position[]; // Path points
  selected: boolean;
}

export interface CircuitState {
  components: CircuitComponent[];
  wires: Wire[];
  mode: CircuitMode;
  selectedComponentId: string | null;
  gridSize: number;
  draggingComponent: boolean;
  snap: boolean;
}
