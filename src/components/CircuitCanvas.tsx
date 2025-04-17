
import React, { useRef, useState, useEffect } from 'react';
import { useCircuit } from '@/context/CircuitContext';
import { renderComponent, Wire } from './CircuitComponents/ComponentDefinitions';
import { snapToGrid } from '@/utils/circuitUtils';

export const CircuitCanvas: React.FC = () => {
  const { state, updateComponent, selectComponent, setDragging } = useCircuit();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle mouse move for dragging components
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const cursorPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
      
      setCurrentMousePos({ x: cursorPoint.x, y: cursorPoint.y });

      if (isDragging && dragStart && state.selectedComponentId) {
        const selectedComponent = state.components.find(c => c.id === state.selectedComponentId);
        if (selectedComponent) {
          const deltaX = cursorPoint.x - dragStart.x;
          const deltaY = cursorPoint.y - dragStart.y;
          
          let newX = selectedComponent.position.x + deltaX;
          let newY = selectedComponent.position.y + deltaY;
          
          // Snap to grid if enabled
          if (state.snap) {
            const snapped = snapToGrid({ x: newX, y: newY }, state.gridSize);
            newX = snapped.x;
            newY = snapped.y;
          }
          
          updateComponent(state.selectedComponentId, {
            position: { x: newX, y: newY }
          });
          
          setDragStart({ x: cursorPoint.x, y: cursorPoint.y });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragging(false);
        setDragStart(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, state.selectedComponentId, state.components, state.snap, state.gridSize, updateComponent, setDragging]);

  // Start dragging a component
  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const cursorPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    
    e.stopPropagation();
    selectComponent(componentId);
    setIsDragging(true);
    setDragging(true);
    setDragStart({ x: cursorPoint.x, y: cursorPoint.y });
  };

  // Handle click on the canvas (deselect all)
  const handleCanvasClick = () => {
    selectComponent(null);
  };

  // Create grid pattern
  const renderGrid = () => {
    if (!state.gridSize || state.gridSize <= 0) return null;
    
    const width = 2000;
    const height = 1500;
    const gridSize = state.gridSize;
    
    const horizontalLines = [];
    const verticalLines = [];
    
    for (let i = 0; i <= height; i += gridSize) {
      horizontalLines.push(
        <line 
          key={`h-${i}`}
          x1="0"
          y1={i} 
          x2={width} 
          y2={i}
          stroke="var(--circuit-grid)"
          strokeWidth="1"
          strokeDasharray={i % (gridSize * 5) === 0 ? "0" : "2,2"}
        />
      );
    }
    
    for (let i = 0; i <= width; i += gridSize) {
      verticalLines.push(
        <line 
          key={`v-${i}`}
          x1={i} 
          y1="0" 
          x2={i} 
          y2={height}
          stroke="var(--circuit-grid)"
          strokeWidth="1"
          strokeDasharray={i % (gridSize * 5) === 0 ? "0" : "2,2"}
        />
      );
    }
    
    return (
      <g className="grid">
        {horizontalLines}
        {verticalLines}
      </g>
    );
  };

  return (
    <div className="flex-1 h-full overflow-hidden bg-circuit-canvas">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full"
        onClick={handleCanvasClick}
      >
        {/* Grid Pattern */}
        {renderGrid()}
        
        {/* Wires */}
        {state.wires.map(wire => (
          <Wire
            key={wire.id}
            wirePoints={wire.points.length > 0 ? wire.points : getWirePointsFromNodeIds(wire.from, wire.to, state.components)}
            selected={wire.selected}
          />
        ))}
        
        {/* Components */}
        {state.components.map(component => (
          <g 
            key={component.id} 
            onClick={(e) => {
              e.stopPropagation();
              selectComponent(component.id);
            }}
            onMouseDown={(e) => handleMouseDown(e, component.id)}
            style={{ cursor: 'move' }}
          >
            {renderComponent(component)}
          </g>
        ))}
        
        {/* Debug: Current Mouse Position */}
        <text x="10" y="20" fontSize="12" fill="gray">
          {Math.round(currentMousePos.x)}, {Math.round(currentMousePos.y)}
        </text>
      </svg>
    </div>
  );
};

// Helper to calculate wire points between nodes
function getWirePointsFromNodeIds(fromId: string, toId: string, components: any[]): { x: number; y: number }[] {
  // Find nodes by ID
  let fromNode = null;
  let toNode = null;
  
  for (const component of components) {
    for (const node of component.nodes) {
      if (node.id === fromId) fromNode = node;
      if (node.id === toId) toNode = node;
    }
    
    if (fromNode && toNode) break;
  }
  
  if (!fromNode || !toNode) return [];
  
  // For simple straight wires
  return [
    { x: fromNode.position.x, y: fromNode.position.y },
    { x: toNode.position.x, y: toNode.position.y }
  ];
  
  // For more complex wiring with right angles, we could do something like:
  /*
  return [
    { x: fromNode.position.x, y: fromNode.position.y },
    { x: fromNode.position.x, y: (fromNode.position.y + toNode.position.y) / 2 },
    { x: toNode.position.x, y: (fromNode.position.y + toNode.position.y) / 2 },
    { x: toNode.position.x, y: toNode.position.y }
  ];
  */
}

export default CircuitCanvas;
