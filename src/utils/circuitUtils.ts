
import { Position, CircuitComponent } from "@/types/circuitTypes";

/**
 * Snap a position to the grid
 */
export function snapToGrid(position: Position, gridSize: number): Position {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Calculate the distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Format component values with appropriate units
 */
export function formatComponentValue(component: CircuitComponent): string {
  const { type, value } = component;

  switch (type) {
    case "resistor":
      return formatResistance(value);
    case "capacitor":
      return formatCapacitance(value);
    case "inductor":
      return formatInductance(value);
    case "voltageSource":
      return `${value} V`;
    case "currentSource":
      return formatCurrent(value);
    default:
      return `${value}`;
  }
}

/**
 * Format resistance values
 */
export function formatResistance(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} MΩ`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} kΩ`;
  } else {
    return `${value.toFixed(1)} Ω`;
  }
}

/**
 * Format capacitance values
 */
export function formatCapacitance(value: number): string {
  if (value < 0.000000001) {
    return `${(value * 1000000000000).toFixed(1)} pF`;
  } else if (value < 0.000001) {
    return `${(value * 1000000000).toFixed(1)} nF`;
  } else if (value < 0.001) {
    return `${(value * 1000000).toFixed(1)} μF`;
  } else {
    return `${(value * 1000).toFixed(1)} mF`;
  }
}

/**
 * Format inductance values
 */
export function formatInductance(value: number): string {
  if (value < 0.000001) {
    return `${(value * 1000000000).toFixed(1)} nH`;
  } else if (value < 0.001) {
    return `${(value * 1000000).toFixed(1)} μH`;
  } else if (value < 1) {
    return `${(value * 1000).toFixed(1)} mH`;
  } else {
    return `${value.toFixed(1)} H`;
  }
}

/**
 * Format current values
 */
export function formatCurrent(value: number): string {
  if (value < 0.001) {
    return `${(value * 1000000).toFixed(1)} μA`;
  } else if (value < 1) {
    return `${(value * 1000).toFixed(1)} mA`;
  } else {
    return `${value.toFixed(1)} A`;
  }
}

/**
 * Rotate a position around an origin
 */
export function rotatePoint(point: Position, origin: Position, angle: number): Position {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  const x = origin.x + (point.x - origin.x) * cos - (point.y - origin.y) * sin;
  const y = origin.y + (point.x - origin.x) * sin + (point.y - origin.y) * cos;
  
  return { x, y };
}
