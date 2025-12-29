// ============================================================================
// SHADER LOADER UTILITY
// ============================================================================
// Loads and concatenates shader modules for WebGL
// Modules are combined in dependency order for proper compilation

// Core modules (shared between vertex and fragment)
import acousticField from './modules/acousticField.glsl?raw';
import sdfShapes from './modules/sdfShapes.glsl?raw';
import shapeMorphing from './modules/shapeMorphing.glsl?raw';

// Vertex-specific modules
import vertexHelpers from './modules/vertexHelpers.glsl?raw';
import vertexMain from './vertex.glsl?raw';

// Fragment-specific modules
import fragmentHelpers from './modules/fragmentHelpers.glsl?raw';
import fragmentMain from './fragment.glsl?raw';

/**
 * Combines shader modules in the correct dependency order
 * @param {string[]} modules - Array of module source code
 * @returns {string} Combined shader source
 */
function combineModules(modules) {
  return modules.join('\n\n');
}

/**
 * Gets the vertex shader with all required modules
 * @returns {string} Complete vertex shader
 */
export function getVertexShader() {
  return combineModules([
    acousticField,
    sdfShapes,
    shapeMorphing,
    vertexHelpers,
    vertexMain
  ]);
}

/**
 * Gets the fragment shader with all required modules
 * @returns {string} Complete fragment shader
 */
export function getFragmentShader() {
  return combineModules([
    acousticField,
    sdfShapes,
    shapeMorphing,
    fragmentHelpers,
    fragmentMain
  ]);
}

