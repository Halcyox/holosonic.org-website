// ============================================================================
// SHADER LOADER UTILITY
// ============================================================================
// Loads and concatenates shader files for WebGL

import commonShader from './common.glsl?raw';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

/**
 * Combines common shader functions with a specific shader
 * @param {string} shaderSource - The shader source code
 * @returns {string} Combined shader source
 */
function combineShader(shaderSource) {
  return `${commonShader}\n\n${shaderSource}`;
}

/**
 * Gets the vertex shader with common functions included
 * @returns {string} Complete vertex shader
 */
export function getVertexShader() {
  return combineShader(vertexShader);
}

/**
 * Gets the fragment shader with common functions included
 * @returns {string} Complete fragment shader
 */
export function getFragmentShader() {
  return combineShader(fragmentShader);
}

