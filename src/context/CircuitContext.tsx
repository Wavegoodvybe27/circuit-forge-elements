
import React, { createContext, useContext, useReducer } from 'react';
import { 
  CircuitState, 
  CircuitComponent, 
  Wire, 
  ComponentType, 
  Position,
  CircuitMode,
  ComponentNode
} from '@/types/circuitTypes';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState: CircuitState = {
  components: [],
  wires: [],
  mode: 'DC',
  selectedComponentId: null,
  gridSize: 20,
  draggingComponent: false,
  snap: true,
};

// Action types
type Action =
  | { type: 'ADD_COMPONENT'; payload: { type: ComponentType; position: Position } }
  | { type: 'REMOVE_COMPONENT'; payload: { id: string } }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<CircuitComponent> } }
  | { type: 'SELECT_COMPONENT'; payload: { id: string | null } }
  | { type: 'ADD_WIRE'; payload: { from: string; to: string } }
  | { type: 'REMOVE_WIRE'; payload: { id: string } }
  | { type: 'SET_MODE'; payload: { mode: CircuitMode } }
  | { type: 'SET_GRID_SIZE'; payload: { size: number } }
  | { type: 'SET_DRAGGING'; payload: { dragging: boolean } }
  | { type: 'TOGGLE_SNAP'; payload: { snap: boolean } };

// Reducer
const circuitReducer = (state: CircuitState, action: Action): CircuitState => {
  switch (action.type) {
    case 'ADD_COMPONENT':
      const id = uuidv4();
      const newComponent: CircuitComponent = {
        id,
        type: action.payload.type,
        position: action.payload.position,
        rotation: 0,
        value: getDefaultValue(action.payload.type),
        label: getDefaultLabel(action.payload.type),
        nodes: generateComponentNodes(id, action.payload.type, action.payload.position),
        selected: false,
        properties: {},
      };
      return {
        ...state,
        components: [...state.components, newComponent],
        selectedComponentId: id,
      };

    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.payload.id),
        wires: state.wires.filter(
          w => !w.from.startsWith(action.payload.id) && !w.to.startsWith(action.payload.id)
        ),
        selectedComponentId: state.selectedComponentId === action.payload.id ? null : state.selectedComponentId,
      };

    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'SELECT_COMPONENT':
      return {
        ...state,
        components: state.components.map(c => ({
          ...c,
          selected: c.id === action.payload.id,
        })),
        selectedComponentId: action.payload.id,
      };

    case 'ADD_WIRE':
      const wireId = uuidv4();
      const newWire: Wire = {
        id: wireId,
        from: action.payload.from,
        to: action.payload.to,
        points: [],
        selected: false,
      };
      return {
        ...state,
        wires: [...state.wires, newWire],
      };

    case 'REMOVE_WIRE':
      return {
        ...state,
        wires: state.wires.filter(w => w.id !== action.payload.id),
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload.mode,
      };

    case 'SET_GRID_SIZE':
      return {
        ...state,
        gridSize: action.payload.size,
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        draggingComponent: action.payload.dragging,
      };

    case 'TOGGLE_SNAP':
      return {
        ...state,
        snap: action.payload.snap,
      };

    default:
      return state;
  }
};

// Helper functions
function getDefaultValue(type: ComponentType): number {
  switch (type) {
    case 'resistor':
      return 1000; // 1k ohm
    case 'capacitor':
      return 0.000001; // 1μF
    case 'inductor':
      return 0.001; // 1mH
    case 'voltageSource':
      return 5; // 5V
    case 'currentSource':
      return 0.01; // 10mA
    default:
      return 0;
  }
}

function getDefaultLabel(type: ComponentType): string {
  switch (type) {
    case 'resistor':
      return 'R';
    case 'capacitor':
      return 'C';
    case 'inductor':
      return 'L';
    case 'voltageSource':
      return 'V';
    case 'currentSource':
      return 'I';
    case 'ground':
      return 'GND';
    case 'switch':
      return 'SW';
    case 'diode':
      return 'D';
    case 'led':
      return 'LED';
    default:
      return '';
  }
}

function generateComponentNodes(
  componentId: string,
  type: ComponentType,
  position: Position
): ComponentNode[] {
  // Basic components have two nodes
  if (['resistor', 'capacitor', 'inductor', 'voltageSource', 'currentSource', 'switch', 'diode', 'led'].includes(type)) {
    return [
      { id: `${componentId}-node-1`, position: { x: position.x - 20, y: position.y } },
      { id: `${componentId}-node-2`, position: { x: position.x + 20, y: position.y } },
    ];
  }

  // Ground has one node
  if (type === 'ground') {
    return [{ id: `${componentId}-node-1`, position: { x: position.x, y: position.y - 10 } }];
  }

  return [];
}

// Create the context
type CircuitContextType = {
  state: CircuitState;
  addComponent: (type: ComponentType, position: Position) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<CircuitComponent>) => void;
  selectComponent: (id: string | null) => void;
  addWire: (from: string, to: string) => void;
  removeWire: (id: string) => void;
  setMode: (mode: CircuitMode) => void;
  setGridSize: (size: number) => void;
  setDragging: (dragging: boolean) => void;
  toggleSnap: (snap: boolean) => void;
};

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

// Provider component
export const CircuitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(circuitReducer, initialState);

  const addComponent = (type: ComponentType, position: Position) => {
    dispatch({ type: 'ADD_COMPONENT', payload: { type, position } });
  };

  const removeComponent = (id: string) => {
    dispatch({ type: 'REMOVE_COMPONENT', payload: { id } });
  };

  const updateComponent = (id: string, updates: Partial<CircuitComponent>) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } });
  };

  const selectComponent = (id: string | null) => {
    dispatch({ type: 'SELECT_COMPONENT', payload: { id } });
  };

  const addWire = (from: string, to: string) => {
    dispatch({ type: 'ADD_WIRE', payload: { from, to } });
  };

  const removeWire = (id: string) => {
    dispatch({ type: 'REMOVE_WIRE', payload: { id } });
  };

  const setMode = (mode: CircuitMode) => {
    dispatch({ type: 'SET_MODE', payload: { mode } });
  };

  const setGridSize = (size: number) => {
    dispatch({ type: 'SET_GRID_SIZE', payload: { size } });
  };

  const setDragging = (dragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', payload: { dragging } });
  };

  const toggleSnap = (snap: boolean) => {
    dispatch({ type: 'TOGGLE_SNAP', payload: { snap } });
  };

  const value = {
    state,
    addComponent,
    removeComponent,
    updateComponent,
    selectComponent,
    addWire,
    removeWire,
    setMode,
    setGridSize,
    setDragging,
    toggleSnap,
  };

  return <CircuitContext.Provider value={value}>{children}</CircuitContext.Provider>;
};

// Custom hook to use the circuit context
export const useCircuit = () => {
  const context = useContext(CircuitContext);
  if (context === undefined) {
    throw new Error('useCircuit must be used within a CircuitProvider');
  }
  return context;
};
