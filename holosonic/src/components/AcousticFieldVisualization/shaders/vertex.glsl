// ============================================================================
// VERTEX SHADER MAIN
// ============================================================================
// Handles vertex displacement, shape morphing, and normal calculation

uniform float time;
uniform float shapeMorph;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying float vShapeFactor;

void main() {
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  float pressure = calculatePressure(worldPos, time);
  float nodeStrength = calculateNodeStrength(worldPos, time);
  
  float morphTime = shapeMorph;
  float shapeDistance = morphShape(worldPos, morphTime);
  
  float cycle = mod(morphTime, 5.0);
  vShapeFactor = calculateShapeFactor(morphTime);
  float isOctahedronTransition = detectOctahedronTransition(cycle);
  
  // Calculate all displacement components
  float shapeDisplacement = calculateShapeDisplacement(shapeDistance, isOctahedronTransition);
  shapeDisplacement += calculateAcousticStreaming(worldPos, time, nodeStrength, shapeDistance, isOctahedronTransition);
  
  float radiationDisplacement = calculateRadiationPressureDisplacement(worldPos, time, pressure, nodeStrength);
  float streamingOscillations = calculateStreamingOscillations(worldPos, time, nodeStrength);
  
  float transitionSmoothing = calculateTransitionSmoothing(cycle);
  
  // Combine all displacements
  float displacement = shapeDisplacement + 
                      (radiationDisplacement + streamingOscillations) * transitionSmoothing;
  
  vec3 k = vec3(1.5, 2.0, 1.2);
  vec3 omega = vec3(1.5, 1.2, 1.35);
  float pressureVariation = sin(time * omega.x) * cos(time * omega.y) * sin(time * omega.z) * 0.01;
  displacement += pressureVariation * nodeStrength;
  
  vDisplacement = displacement;
  
  // Calculate accurate normal
  vNormal = calculateAccurateNormal(position, morphTime, isOctahedronTransition);
  
  // Final position
  vec3 newPosition = position + normal * displacement;
  
  vPosition = newPosition;
  vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
