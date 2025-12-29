// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
// Centralized animation parameters for the ParticleSwarm component

import { SHAPE_MORPHING } from './shaderConstants.js';

/**
 * Morphing animation configuration
 */
export const MORPHING_CONFIG = {
  // Speed of morphing cycle (cycles per second)
  SPEED: SHAPE_MORPHING.SPEED,
  
  // Initial morph value (1.0 = start at cube)
  INITIAL: SHAPE_MORPHING.INITIAL_VALUE,
  
  // Calculate morph value from time
  calculateMorph: (time) => {
    return ((time * MORPHING_CONFIG.SPEED) + MORPHING_CONFIG.INITIAL) % SHAPE_MORPHING.NUM_SHAPES;
  },
};

/**
 * Rotation animation configuration
 */
export const ROTATION_CONFIG = {
  X: {
    primary: { frequency: 0.5, amplitude: 0.2 },
    secondary: { frequency: 0.25, amplitude: 0.05 },
    calculate: (time) => {
      return Math.sin(time * 0.5) * 0.2 + Math.cos(time * 0.25) * 0.05;
    },
  },
  
  Y: {
    primary: { frequency: 0.6, amplitude: 1.0 },
    secondary: { frequency: 0.3, amplitude: 0.1 },
    calculate: (time) => {
      return time * 0.6 + Math.sin(time * 0.3) * 0.1;
    },
  },
  
  Z: {
    primary: { frequency: 0.45, amplitude: 0.12 },
    secondary: { frequency: 0.27, amplitude: 0.05 },
    calculate: (time) => {
      return Math.cos(time * 0.45) * 0.12 + Math.sin(time * 0.27) * 0.05;
    },
  },
  
  // Calculate all rotations at once
  calculateAll: (time) => {
    return {
      x: ROTATION_CONFIG.X.calculate(time),
      y: ROTATION_CONFIG.Y.calculate(time),
      z: ROTATION_CONFIG.Z.calculate(time),
    };
  },
};

/**
 * Animation update configuration
 */
export const ANIMATION_CONFIG = {
  // Throttle updates (milliseconds) - set to 0 for no throttling
  THROTTLE_MS: 0,
  
  // Whether to use requestAnimationFrame throttling
  USE_RAF: true,
};

