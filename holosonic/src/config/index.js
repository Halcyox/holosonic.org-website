// ============================================================================
// CONFIGURATION EXPORTS
// ============================================================================
// Centralized export point for all configuration

export * from './shaderConstants';
export * from './animationConfig';

// Re-export commonly used configs with convenient names
export { WAVE_CONSTANTS, SHAPE_MORPHING, GEOMETRY, DISPLACEMENT, NORMALS, LIGHTING, MATERIAL } from './shaderConstants';
export { MORPHING_CONFIG, ROTATION_CONFIG, ANIMATION_CONFIG } from './animationConfig';

