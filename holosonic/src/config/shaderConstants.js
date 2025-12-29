// ============================================================================
// SHADER CONSTANTS
// ============================================================================
// Centralized configuration for all shader-related constants
// This provides a single source of truth and makes tuning parameters easier

/**
 * Wave constants for acoustic pressure field calculations
 * These represent the physical parameters of the transducer array
 */
export const WAVE_CONSTANTS = {
  // Spatial frequencies (wave numbers) - k in sin(kx)
  K1: 1.5,      // X-axis transducer pair
  K2: 2.0,      // Y-axis transducer pair
  K3: 1.2,      // Z-axis transducer pair
  K_DIAG: 0.9,  // Diagonal transducer pairs
  
  // Temporal frequencies (angular frequencies) - ω in cos(ωt)
  OMEGA1: 1.5,
  OMEGA2: 1.2,
  OMEGA3: 1.35,
  OMEGA_DIAG: 1.1,
  
  // Wave combination weights
  WEIGHTS: {
    PRIMARY: 0.25,      // Weight for X, Y, Z waves
    DIAGONAL_XY: 0.1,   // Weight for XY diagonal wave
    DIAGONAL_XZ: 0.08,  // Weight for XZ diagonal wave
    DIAGONAL_YZ: 0.07,  // Weight for YZ diagonal wave
  },
  
  // Position scaling
  POSITION_SCALE: 1.2,
  
  // Amplitude modulation (transducer power control)
  AMPLITUDE_MOD: {
    FREQUENCY: 0.6,
    RANGE: 0.05,
    BASE: 0.95,
  },
  
  // Node detection thresholds
  NODE_DETECTION: {
    PROXIMITY_THRESHOLD: 0.15,
    NODE_THRESHOLD: 0.2,
    MULTI_NODE_STRENGTH: 0.5,
    NODE_PROXIMITY_WEIGHT: 0.7,
  },
};

/**
 * Shape morphing configuration
 */
export const SHAPE_MORPHING = {
  // Number of shapes in the morphing cycle
  NUM_SHAPES: 5,
  
  // Morphing speed (cycles per second)
  SPEED: 0.2,
  
  // Initial morph value (to start at cube)
  INITIAL_VALUE: 1.0,
  
  // Transition zone definitions for smooth weight blending
  TRANSITION_ZONES: {
    W0: { fadeOut: { start: 0.8, end: 1.2 } },  // sphere -> cube
    W1: { fadeIn: { start: 0.8, end: 1.2 }, fadeOut: { start: 1.8, end: 2.2 } },  // cube -> torus
    W2: { fadeIn: { start: 1.8, end: 2.2 }, fadeOut: { start: 2.8, end: 3.2 } },  // torus -> octahedron
    W3: { fadeIn: { start: 2.8, end: 3.2 }, fadeOut: { start: 3.8, end: 4.2 } },  // octahedron -> teardrop
    W4: { fadeIn: { start: 3.8, end: 4.2 } },  // teardrop -> sphere
  },
  
  // Shape factor (for coloring) configuration
  SHAPE_FACTOR: {
    MIN: 0.3,
    MAX: 1.0,
    FADE_DISTANCE: 0.3,
  },
};

/**
 * Geometry parameters for SDF shapes
 */
export const GEOMETRY = {
  SPHERE: {
    RADIUS: 2.0,
    SEGMENTS: 48,
  },
  
  CUBE: {
    SIZE: 1.6,
  },
  
  TORUS: {
    MAJOR_RADIUS: 1.5,
    MINOR_RADIUS: 0.5,
  },
  
  OCTAHEDRON: {
    SIZE: 1.8,
    SCALE: 0.577,
  },
  
  TEARDROP: {
    SCALE: 0.8,
    SPHERE_RADIUS: 1.0,
    SPHERE_CENTER: 0.5,
    CONE_TOP: -0.5,
    CONE_BOTTOM: -1.5,
    CONE_TOP_RADIUS: 0.7,
    SMOOTHING: 0.3,
  },
};

/**
 * Displacement and deformation parameters
 */
export const DISPLACEMENT = {
  BASE_STRENGTH: 0.6,
  OCTAHEDRON_REDUCTION: 0.7,  // Reduce during octahedron transitions
  
  // Smoothing parameters
  NORMALIZATION_DIVISOR: 0.5,
  MAX_DISPLACEMENT: 0.8,
  
  // Acoustic streaming
  STREAMING: {
    STRENGTH: 0.02,
    OCTAHEDRON_REDUCTION: 0.01,
    NODE_MULTIPLIER: 0.5,
    DISTANCE_FACTOR: 0.2,
  },
  
  // Radiation pressure
  RADIATION_PRESSURE: {
    GRADIENT_EPSILON: 0.02,
    FORCE_MULTIPLIER: 2.0,
    MATERIAL_STRENGTH: 0.15,
    PRESSURE_STRENGTH: 0.2,
  },
  
  // Transition smoothing
  TRANSITION: {
    SMOOTH_ZONE: { start: 0.1, end: 0.9 },
    DAMPING_FACTOR: 0.8,
    OTHER_DISPLACEMENT_BASE: 0.15,
  },
};

/**
 * Normal calculation parameters
 */
export const NORMALS = {
  BASE_EPSILON: 0.02,
  OCTAHEDRON_EPSILON: 0.04,
  
  BLEND_FACTOR: {
    NORMAL: 0.5,
    OCTAHEDRON: 0.15,
  },
  
  GRADIENT_THRESHOLDS: {
    MIN_NORMAL: 0.001,
    MIN_OCTAHEDRON: 0.005,
    MAX_NORMAL: 0.1,
    MAX_OCTAHEDRON: 0.2,
  },
  
  GRADIENT_MAGNITUDE: {
    MAX_NORMAL: 2.0,
    MAX_OCTAHEDRON: 1.0,
  },
  
  FALLBACK_THRESHOLDS: {
    NORMAL: 0.001,
    OCTAHEDRON: 0.01,
    FINAL: { start: 0.05, end: 0.1 },
  },
};

/**
 * Lighting and visual parameters
 */
export const LIGHTING = {
  FRESNEL: {
    F0: 0.04,
    POWER: 5.0,
    CHROMATIC_POWER: 0.6,
  },
  
  KEY_LIGHT: {
    DIRECTION: [0.8, 1.2, 0.6],
    INTENSITY: 0.7,
    COLOR: [1.0, 0.98, 0.95],
    DIFFUSE_POWER: 0.9,
  },
  
  FILL_LIGHT: {
    DIRECTION: [-0.6, -0.4, -0.8],
    INTENSITY: 0.4,
    COLOR: [0.9, 0.95, 1.0],
    DIFFUSE_POWER: 1.5,
  },
  
  RIM_LIGHT: {
    NORMAL_OFFSET: 0.6,
    INTENSITY: 0.5,
    POWER: 2.0,
    COLOR: [0.95, 0.98, 1.0],
  },
  
  SPECULAR: {
    ROUGHNESS_RANGE: { min: 0.25, max: 0.4 },
    INTENSITY_BASE: 0.5,
    MATERIAL_REDUCTION: 0.2,
    PRESSURE_MULTIPLIER: 0.1,
  },
  
  AMBIENT: {
    BASE: 0.35,
    DISPLACEMENT_FACTOR: 0.3,
  },
  
  SUBSURFACE: {
    POWER: 2.0,
    BASE: 0.3,
    MATERIAL_MULTIPLIER: 0.4,
    COLOR_COLD: [0.3, 0.7, 1.0],
    COLOR_WARM: [0.5, 0.9, 1.0],
    MATERIAL_BLEND: 0.6,
  },
};

/**
 * Animation parameters
 */
export const ANIMATION = {
  ROTATION: {
    X: { frequency: 0.5, amplitude: 0.2, offset: { frequency: 0.25, amplitude: 0.05 } },
    Y: { frequency: 0.6, offset: { frequency: 0.3, amplitude: 0.1 } },
    Z: { frequency: 0.45, amplitude: 0.12, offset: { frequency: 0.27, amplitude: 0.05 } },
  },
  
  PULSING: {
    MAIN: [
      { frequency: 2.0, amplitude: 0.08 },
      { frequency: 3.5, amplitude: 0.04 },
      { frequency: 1.2, amplitude: 0.06 },
    ],
    BASE: 0.9,
    MATERIAL: [
      { frequency: 1.5, amplitude: 0.12 },
      { frequency: 1.75, amplitude: 0.06 },
    ],
    MATERIAL_BASE: 0.88,
    MATERIAL_MULTIPLIER: 0.12,
    NODE: [
      { frequency: 2.0, phase: 3.14 },
      { frequency: 2.4, phase: 4.71 },
      { frequency: 1.6, phase: 5.0 },
    ],
    NODE_AMPLITUDES: [0.08, 0.04, 0.03],
    NODE_BASE: 0.92,
  },
};

/**
 * Material and rendering parameters
 */
export const MATERIAL = {
  COLOR: '#40e0d0',
  TRANSPARENT: true,
  BLENDING: 'AdditiveBlending',
  DEPTH_WRITE: false,
  SIDE: 'DoubleSide',
  
  ALPHA: {
    BASE: 0.9,
    MIN: 0.4,
  },
};

/**
 * Helper function to convert JavaScript constants to GLSL defines
 * This can be used to inject constants into shaders at build time
 */
export function getGLSLDefines() {
  return `
    // Wave constants
    #define K1 ${WAVE_CONSTANTS.K1}
    #define K2 ${WAVE_CONSTANTS.K2}
    #define K3 ${WAVE_CONSTANTS.K3}
    #define K_DIAG ${WAVE_CONSTANTS.K_DIAG}
    #define OMEGA1 ${WAVE_CONSTANTS.OMEGA1}
    #define OMEGA2 ${WAVE_CONSTANTS.OMEGA2}
    #define OMEGA3 ${WAVE_CONSTANTS.OMEGA3}
    #define OMEGA_DIAG ${WAVE_CONSTANTS.OMEGA_DIAG}
    #define POSITION_SCALE ${WAVE_CONSTANTS.POSITION_SCALE}
    
    // Shape morphing
    #define NUM_SHAPES ${SHAPE_MORPHING.NUM_SHAPES}
    
    // Geometry
    #define SPHERE_RADIUS ${GEOMETRY.SPHERE.RADIUS}
    #define CUBE_SIZE ${GEOMETRY.CUBE.SIZE}
    // ... etc
  `;
}

