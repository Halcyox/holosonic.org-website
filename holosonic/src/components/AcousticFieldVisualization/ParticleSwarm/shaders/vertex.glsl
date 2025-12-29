// ============================================================================
// VERTEX SHADER
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

// Include common functions
// (In WebGL, we include these directly since there's no #include directive)

// Common functions would be included here - see common.glsl
// For now, we'll reference them and they'll be concatenated in the material

void main() {
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  float pressure = calculatePressure(worldPos, time);
  float nodeStrength = calculateNodeStrength(worldPos, time);
  
  // Shape morphing
  float morphTime = shapeMorph;
  float shapeDistance = morphShape(worldPos, morphTime);
  
  // Calculate shape factor for coloring
  // Updated cycle: 5 shapes now (sphere, cube, torus, octahedron, teardrop)
  float cycle = mod(morphTime, 5.0);
  // Ensure vShapeFactor is continuous and never goes too low to prevent darkening
  // Use a simple function that's high in the middle, lower at boundaries, but never below 0.3
  // This prevents the dark flash while maintaining smooth transitions
  float distToBoundary = min(cycle, 5.0 - cycle);  // Distance to nearest boundary
  // Smooth fade from boundaries, but keep minimum at 0.3 to prevent darkening
  vShapeFactor = mix(0.3, 1.0, smoothstep(0.0, 0.3, distToBoundary));
  
  // Detect if we're transitioning to/from octahedron (diamond) for normal calculation
  // Use smoothstep for continuous transitions instead of step() which is discontinuous
  // Smoothly transition in at cycle 2.0 and out at cycle 3.0
  float octahedronStart = smoothstep(1.8, 2.2, cycle);  // Smooth transition in
  float octahedronEnd = 1.0 - smoothstep(2.8, 3.2, cycle);  // Smooth transition out
  float isOctahedronTransition = octahedronStart * octahedronEnd;
  
  // Shape-based displacement
  // Reduce displacement strength during octahedron transitions to prevent fraying
  float baseDisplacementStrength = 0.6;
  float displacementStrength = mix(baseDisplacementStrength, baseDisplacementStrength * 0.7, isOctahedronTransition);
  float shapeDisplacementRaw = -shapeDistance * displacementStrength;
  
  // Smooth displacement - ensure continuity
  // Apply smooth clamping directly to preserve continuity
  float absDisplacement = abs(shapeDisplacementRaw);
  float normalizedDisplacement = clamp(absDisplacement / 0.5, 0.0, 1.0);
  float smoothedNormalized = smoothstep(0.0, 1.0, normalizedDisplacement);
  float maxDisplacement = 0.8;
  float smoothedAbs = smoothedNormalized * maxDisplacement;
  
  // Preserve sign smoothly using continuous function
  // This avoids any discontinuities from conditional logic
  // When shapeDisplacementRaw is near zero, smoothedAbs is also near zero, so result is continuous
  float shapeDisplacement = mix(-smoothedAbs, smoothedAbs, smoothstep(-0.0001, 0.0001, shapeDisplacementRaw));
  
  // Acoustic streaming effects
  // Reduce streaming effects during octahedron transitions
  float k1 = 1.5, k2 = 2.0, k3 = 1.2;
  float omega1 = 1.5, omega2 = 1.2, omega3 = 1.35;
  float streamingStrength = mix(0.02, 0.01, isOctahedronTransition);
  float acousticStreaming = sin(time * omega1 + worldPos.x * k1) * 
                           cos(time * omega2 + worldPos.y * k2) * 
                           sin(time * omega3 + worldPos.z * k3) * streamingStrength;
  shapeDisplacement += acousticStreaming * nodeStrength * (1.0 - abs(shapeDistance) * 0.2);
  
  // Acoustic radiation pressure displacement
  float epsPressure = 0.02;
  float pressureX = calculatePressure(worldPos + vec3(epsPressure, 0.0, 0.0), time);
  float pressureY = calculatePressure(worldPos + vec3(0.0, epsPressure, 0.0), time);
  float pressureZ = calculatePressure(worldPos + vec3(0.0, 0.0, epsPressure), time);
  
  vec3 pressureGradient = vec3(
    (pressureX - pressure) / epsPressure,
    (pressureY - pressure) / epsPressure,
    (pressureZ - pressure) / epsPressure
  );
  
  vec3 radiationForceVector = -2.0 * pressure * pressureGradient;
  float radiationForce = length(radiationForceVector);
  
  float materialDisplacement = nodeStrength * 0.15;
  float pressureDisplacement = radiationForce * 0.2;
  
  // Acoustic streaming oscillations
  float streamingX = sin(time * omega1 + worldPos.x * k1) * cos(time * omega2) * 0.02;
  float streamingY = sin(time * omega2 + worldPos.y * k2) * cos(time * omega3) * 0.02;
  float streamingZ = sin(time * omega3 + worldPos.z * k3) * cos(time * omega1) * 0.02;
  float streamingAmount = (streamingX + streamingY + streamingZ) * nodeStrength * 0.5;
  
  // Enhanced transition smoothing for ultra-smooth morphing
  // Calculate transition progress within current segment (same logic as morphShape)
  float segment = floor(cycle);
  float transitionProgress = cycle - segment;
  transitionProgress = clamp(transitionProgress, 0.0, 1.0);
  
  // Wider smooth zone for better transitions
  // Use smooth transition that's continuous at boundaries
  float transitionSmooth = 1.0 - abs(transitionProgress - 0.5) * 2.0;
  transitionSmooth = smoothstep(0.1, 0.9, transitionSmooth);
  // More aggressive damping during transitions
  float otherDisplacementFactor = 0.15 * (1.0 - transitionSmooth * 0.8);
  
  // Combine displacements
  float displacement = shapeDisplacement + 
                      (pressureDisplacement + materialDisplacement + streamingAmount) * otherDisplacementFactor;
  
  float pressureVariation = sin(time * omega1) * cos(time * omega2) * sin(time * omega3) * 0.01;
  displacement += pressureVariation * nodeStrength;
  
  vDisplacement = displacement;
  
  // Normal calculation from SDF gradient
  // Use adaptive epsilon based on transition state for better stability
  vec3 tempWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  
  // Use larger epsilon during octahedron transitions for stability at sharp edges
  float eps = mix(0.02, 0.04, isOctahedronTransition);
  
  // Also reduce blend factor during octahedron transitions - use mostly original normal
  float transitionFactor = mix(0.5, 0.15, isOctahedronTransition);
  
  vec3 worldPosXp = (modelMatrix * vec4(position + vec3(eps, 0.0, 0.0), 1.0)).xyz;
  vec3 worldPosXm = (modelMatrix * vec4(position + vec3(-eps, 0.0, 0.0), 1.0)).xyz;
  vec3 worldPosYp = (modelMatrix * vec4(position + vec3(0.0, eps, 0.0), 1.0)).xyz;
  vec3 worldPosYm = (modelMatrix * vec4(position + vec3(0.0, -eps, 0.0), 1.0)).xyz;
  vec3 worldPosZp = (modelMatrix * vec4(position + vec3(0.0, 0.0, eps), 1.0)).xyz;
  vec3 worldPosZm = (modelMatrix * vec4(position + vec3(0.0, 0.0, -eps), 1.0)).xyz;
  
  float sdfXp = morphShape(worldPosXp, morphTime);
  float sdfXm = morphShape(worldPosXm, morphTime);
  float sdfYp = morphShape(worldPosYp, morphTime);
  float sdfYm = morphShape(worldPosYm, morphTime);
  float sdfZp = morphShape(worldPosZp, morphTime);
  float sdfZm = morphShape(worldPosZm, morphTime);
  
  vec3 sdfGradient = vec3(
    (sdfXp - sdfXm) / (2.0 * eps),
    (sdfYp - sdfYm) / (2.0 * eps),
    (sdfZp - sdfZm) / (2.0 * eps)
  );
  
  float gradientMag = length(sdfGradient);
  
  // More conservative gradient strength check during octahedron transitions
  float gradientMin = mix(0.001, 0.005, isOctahedronTransition);
  float gradientMax = mix(0.1, 0.2, isOctahedronTransition);
  float gradientStrength = smoothstep(gradientMin, gradientMax, gradientMag);
  
  // Additional smoothing: clamp gradient magnitude to prevent extreme values
  // More aggressive clamping during octahedron transitions
  float maxGradientMag = mix(2.0, 1.0, isOctahedronTransition);
  gradientMag = clamp(gradientMag, 0.0, maxGradientMag);
  
  vec3 accurateNormal = normalize(sdfGradient);
  vec3 originalNormal = normalize(normalMatrix * normal);
  
  // Use adaptive blend factor - more conservative during octahedron transitions
  float blendFactor = transitionFactor * gradientStrength;
  
  // Additional smoothing: if gradient is very unstable, use mostly original normal
  // More aggressive fallback during octahedron transitions
  // Use smoothstep instead of if to avoid discontinuities
  float fallbackThreshold = mix(0.001, 0.01, isOctahedronTransition);
  float fallbackFactor = smoothstep(0.0, fallbackThreshold, gradientMag);
  blendFactor *= fallbackFactor;
  
  // Additional smoothing: smooth the normal blend during transitions
  // This helps prevent sudden jumps in normal direction
  // Reuse transitionProgress already declared above
  
  // Additional smoothing during octahedron transitions
  // Use the already-smooth isOctahedronTransition for consistent smoothing
  float octahedronSmoothFactor = isOctahedronTransition;
  blendFactor *= mix(1.0, octahedronSmoothFactor * 0.3, isOctahedronTransition);
  
  // Final fallback: if we're in the middle of an octahedron transition and gradient is unstable,
  // smoothly disable SDF-based normal
  // Reuse fallbackFactor with updated threshold for final check
  fallbackFactor = smoothstep(0.05, 0.1, gradientMag);
  blendFactor *= mix(0.0, 1.0, fallbackFactor);
  
  vNormal = normalize(mix(originalNormal, accurateNormal, blendFactor));
  
  // Final position
  vec3 newPosition = position + normal * displacement;
  
  vPosition = newPosition;
  vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}

