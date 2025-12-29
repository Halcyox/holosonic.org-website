// ============================================================================
// ACOUSTIC FIELD MODULE
// ============================================================================
// Physically accurate acoustic pressure field calculations

// Wave parameters (centralized for consistency)
vec3 getWaveNumbers() {
  return vec3(1.5, 2.0, 1.2);  // k1, k2, k3
}

vec3 getAngularFrequencies() {
  return vec3(1.5, 1.2, 1.35);  // omega1, omega2, omega3
}

float getDiagonalWaveNumber() {
  return 0.9;
}

float getDiagonalAngularFrequency() {
  return 1.1;
}

// Calculate primary standing waves from orthogonal transducer pairs
vec3 calculatePrimaryWaves(vec3 pos, float time) {
  vec3 p = pos * 1.2;
  vec3 k = getWaveNumbers();
  vec3 omega = getAngularFrequencies();
  
  return vec3(
    sin(p.x * k.x) * cos(time * omega.x),
    sin(p.y * k.y) * cos(time * omega.y),
    sin(p.z * k.z) * cos(time * omega.z)
  );
}

// Calculate diagonal interference patterns
vec3 calculateDiagonalWaves(vec3 pos, float time) {
  vec3 p = pos * 1.2;
  float kDiag = getDiagonalWaveNumber();
  float omegaDiag = getDiagonalAngularFrequency();
  
  return vec3(
    sin((p.x + p.y) * kDiag) * cos((p.x - p.y) * kDiag) * cos(time * omegaDiag),
    sin((p.x + p.z) * kDiag) * cos((p.x - p.z) * kDiag) * cos(time * omegaDiag * 0.9),
    sin((p.y + p.z) * kDiag) * cos((p.y - p.z) * kDiag) * cos(time * omegaDiag * 0.95)
  );
}

// Standing waves: sin(kx) * cos(ωt) where nodes occur at sin(kx) = 0
// Multiple transducer pairs create 3D interference patterns
float calculatePressure(vec3 pos, float t) {
  vec3 primaryWaves = calculatePrimaryWaves(pos, t);
  vec3 diagonalWaves = calculateDiagonalWaves(pos, t);
  
  // Combine waves with proper weighting
  float pressure = primaryWaves.x * 0.25 + primaryWaves.y * 0.25 + primaryWaves.z * 0.25 + 
                  diagonalWaves.x * 0.1 + diagonalWaves.y * 0.08 + diagonalWaves.z * 0.07;
  
  // Amplitude modulation (represents transducer power control)
  float amplitudeMod = sin(t * 0.6) * 0.05 + 0.95;
  
  return pressure * amplitudeMod;
}

// Nodes are where pressure = 0 in standing waves (particles trapped here)
// Material accumulates at nodes due to acoustic radiation pressure
float calculateNodeStrength(vec3 pos, float t) {
  vec3 p = pos * 1.2;
  vec3 k = getWaveNumbers();
  float pressure = calculatePressure(pos, t);
  
  // Nodes occur where pressure is near zero
  float nodeProximity = 1.0 - smoothstep(0.0, 0.15, abs(pressure));
  
  // Additional factor: nodes are stronger where multiple waves have zero crossings
  float nodeX = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.x * k.x)));
  float nodeY = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.y * k.y)));
  float nodeZ = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.z * k.z)));
  
  // Strongest nodes where all three primary waves have nodes simultaneously
  float multiNodeStrength = nodeX * nodeY * nodeZ * 0.5;
  
  float nodeStrength = nodeProximity * 0.7 + multiNodeStrength;
  
  return clamp(nodeStrength, 0.0, 1.0);
}

