// ============================================================================
// VERTEX SHADER HELPER FUNCTIONS
// ============================================================================

// Calculate shape factor for coloring (prevents darkening during transitions)
float calculateShapeFactor(float morphTime) {
  float cycle = mod(morphTime, 5.0);
  float distToBoundary = min(cycle, 5.0 - cycle);
  return mix(0.3, 1.0, smoothstep(0.0, 0.3, distToBoundary));
}

// Detect octahedron transition state for special handling
float detectOctahedronTransition(float cycle) {
  float octahedronStart = smoothstep(1.8, 2.2, cycle);
  float octahedronEnd = 1.0 - smoothstep(2.8, 3.2, cycle);
  return octahedronStart * octahedronEnd;
}

// Calculate shape-based displacement with smoothing
float calculateShapeDisplacement(float shapeDistance, float isOctahedronTransition) {
  float baseDisplacementStrength = 0.6;
  float displacementStrength = mix(baseDisplacementStrength, baseDisplacementStrength * 0.7, isOctahedronTransition);
  float shapeDisplacementRaw = -shapeDistance * displacementStrength;
  
  // Smooth displacement - ensure continuity
  float absDisplacement = abs(shapeDisplacementRaw);
  float normalizedDisplacement = clamp(absDisplacement / 0.5, 0.0, 1.0);
  float smoothedNormalized = smoothstep(0.0, 1.0, normalizedDisplacement);
  float maxDisplacement = 0.8;
  float smoothedAbs = smoothedNormalized * maxDisplacement;
  
  // Preserve sign smoothly using continuous function
  return mix(-smoothedAbs, smoothedAbs, smoothstep(-0.0001, 0.0001, shapeDisplacementRaw));
}

// Calculate acoustic streaming displacement
float calculateAcousticStreaming(vec3 worldPos, float time, float nodeStrength, float shapeDistance, float isOctahedronTransition) {
  vec3 k = vec3(1.5, 2.0, 1.2);
  vec3 omega = vec3(1.5, 1.2, 1.35);
  float streamingStrength = mix(0.02, 0.01, isOctahedronTransition);
  
  float acousticStreaming = sin(time * omega.x + worldPos.x * k.x) * 
                           cos(time * omega.y + worldPos.y * k.y) * 
                           sin(time * omega.z + worldPos.z * k.z) * streamingStrength;
  
  return acousticStreaming * nodeStrength * (1.0 - abs(shapeDistance) * 0.2);
}

// Calculate acoustic radiation pressure displacement
float calculateRadiationPressureDisplacement(vec3 worldPos, float time, float pressure, float nodeStrength) {
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
  
  return materialDisplacement + pressureDisplacement;
}

// Calculate acoustic streaming oscillations
float calculateStreamingOscillations(vec3 worldPos, float time, float nodeStrength) {
  vec3 k = vec3(1.5, 2.0, 1.2);
  vec3 omega = vec3(1.5, 1.2, 1.35);
  
  float streamingX = sin(time * omega.x + worldPos.x * k.x) * cos(time * omega.y) * 0.02;
  float streamingY = sin(time * omega.y + worldPos.y * k.y) * cos(time * omega.z) * 0.02;
  float streamingZ = sin(time * omega.z + worldPos.z * k.z) * cos(time * omega.x) * 0.02;
  
  return (streamingX + streamingY + streamingZ) * nodeStrength * 0.5;
}

// Calculate transition smoothing factor
float calculateTransitionSmoothing(float cycle) {
  float segment = floor(cycle);
  float transitionProgress = clamp(cycle - segment, 0.0, 1.0);
  float transitionSmooth = 1.0 - abs(transitionProgress - 0.5) * 2.0;
  transitionSmooth = smoothstep(0.1, 0.9, transitionSmooth);
  return 0.15 * (1.0 - transitionSmooth * 0.8);
}

// Calculate SDF gradient for normal calculation
vec3 calculateSDFGradient(vec3 position, float morphTime, float eps) {
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
  
  return vec3(
    (sdfXp - sdfXm) / (2.0 * eps),
    (sdfYp - sdfYm) / (2.0 * eps),
    (sdfZp - sdfZm) / (2.0 * eps)
  );
}

// Calculate accurate normal from SDF gradient with adaptive blending
vec3 calculateAccurateNormal(vec3 position, float morphTime, float isOctahedronTransition) {
  float eps = mix(0.02, 0.04, isOctahedronTransition);
  vec3 sdfGradient = calculateSDFGradient(position, morphTime, eps);
  
  float gradientMag = length(sdfGradient);
  
  // Gradient strength check
  float gradientMin = mix(0.001, 0.005, isOctahedronTransition);
  float gradientMax = mix(0.1, 0.2, isOctahedronTransition);
  float gradientStrength = smoothstep(gradientMin, gradientMax, gradientMag);
  
  // Clamp gradient magnitude
  float maxGradientMag = mix(2.0, 1.0, isOctahedronTransition);
  gradientMag = clamp(gradientMag, 0.0, maxGradientMag);
  
  vec3 accurateNormal = normalize(sdfGradient);
  vec3 originalNormal = normalize(normalMatrix * normal);
  
  // Adaptive blend factor
  float transitionFactor = mix(0.5, 0.15, isOctahedronTransition);
  float blendFactor = transitionFactor * gradientStrength;
  
  // Fallback for unstable gradients
  float fallbackThreshold = mix(0.001, 0.01, isOctahedronTransition);
  float fallbackFactor = smoothstep(0.0, fallbackThreshold, gradientMag);
  blendFactor *= fallbackFactor;
  
  // Additional smoothing during octahedron transitions
  float octahedronSmoothFactor = isOctahedronTransition;
  blendFactor *= mix(1.0, octahedronSmoothFactor * 0.3, isOctahedronTransition);
  
  // Final fallback
  fallbackFactor = smoothstep(0.05, 0.1, gradientMag);
  blendFactor *= mix(0.0, 1.0, fallbackFactor);
  
  return normalize(mix(originalNormal, accurateNormal, blendFactor));
}

