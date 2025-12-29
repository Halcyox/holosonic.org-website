// ============================================================================
// COMMON SHADER FUNCTIONS
// ============================================================================
// Shared functions used by both vertex and fragment shaders
// Physically accurate acoustic pressure field calculations

// ----------------------------------------------------------------------------
// Acoustic Pressure Calculation
// ----------------------------------------------------------------------------
// Standing waves: sin(kx) * cos(ωt) where nodes occur at sin(kx) = 0
// Multiple transducer pairs create 3D interference patterns
float calculatePressure(vec3 pos, float t) {
  vec3 p = pos * 1.2;
  
  // Wave numbers (spatial frequencies) for each transducer pair
  float k1 = 1.5; // X-axis
  float k2 = 2.0; // Y-axis
  float k3 = 1.2; // Z-axis
  
  // Angular frequencies (temporal frequencies)
  float omega1 = 1.5;
  float omega2 = 1.2;
  float omega3 = 1.35;
  
  // Primary standing waves from three orthogonal transducer pairs
  float waveX = sin(p.x * k1) * cos(t * omega1);
  float waveY = sin(p.y * k2) * cos(t * omega2);
  float waveZ = sin(p.z * k3) * cos(t * omega3);
  
  // Diagonal transducer pairs create additional interference patterns
  float kDiag = 0.9;
  float omegaDiag = 1.1;
  
  float waveXY = sin((p.x + p.y) * kDiag) * cos((p.x - p.y) * kDiag) * cos(t * omegaDiag);
  float waveXZ = sin((p.x + p.z) * kDiag) * cos((p.x - p.z) * kDiag) * cos(t * omegaDiag * 0.9);
  float waveYZ = sin((p.y + p.z) * kDiag) * cos((p.y - p.z) * kDiag) * cos(t * omegaDiag * 0.95);
  
  // Combine waves with proper weighting
  float pressure = waveX * 0.25 + waveY * 0.25 + waveZ * 0.25 + 
                  waveXY * 0.1 + waveXZ * 0.08 + waveYZ * 0.07;
  
  // Amplitude modulation (represents transducer power control)
  float amplitudeMod = sin(t * 0.6) * 0.05 + 0.95;
  
  return pressure * amplitudeMod;
}

// ----------------------------------------------------------------------------
// Pressure Node Strength Calculation
// ----------------------------------------------------------------------------
// Nodes are where pressure = 0 in standing waves (particles trapped here)
// Material accumulates at nodes due to acoustic radiation pressure
float calculateNodeStrength(vec3 pos, float t) {
  vec3 p = pos * 1.2;
  
  float k1 = 1.5;
  float k2 = 2.0;
  float k3 = 1.2;
  float omega1 = 1.5;
  float omega2 = 1.2;
  float omega3 = 1.35;
  
  float waveX = sin(p.x * k1) * cos(t * omega1);
  float waveY = sin(p.y * k2) * cos(t * omega2);
  float waveZ = sin(p.z * k3) * cos(t * omega3);
  
  float kDiag = 0.9;
  float omegaDiag = 1.1;
  float waveXY = sin((p.x + p.y) * kDiag) * cos((p.x - p.y) * kDiag) * cos(t * omegaDiag);
  float waveXZ = sin((p.x + p.z) * kDiag) * cos((p.x - p.z) * kDiag) * cos(t * omegaDiag * 0.9);
  float waveYZ = sin((p.y + p.z) * kDiag) * cos((p.y - p.z) * kDiag) * cos(t * omegaDiag * 0.95);
  
  float pressure = waveX * 0.25 + waveY * 0.25 + waveZ * 0.25 + 
                  waveXY * 0.1 + waveXZ * 0.08 + waveYZ * 0.07;
  
  // Nodes occur where pressure is near zero
  float nodeProximity = 1.0 - smoothstep(0.0, 0.15, abs(pressure));
  
  // Additional factor: nodes are stronger where multiple waves have zero crossings
  float nodeX = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.x * k1)));
  float nodeY = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.y * k2)));
  float nodeZ = 1.0 - smoothstep(0.0, 0.2, abs(sin(p.z * k3)));
  
  // Strongest nodes where all three primary waves have nodes simultaneously
  float multiNodeStrength = nodeX * nodeY * nodeZ * 0.5;
  
  float nodeStrength = nodeProximity * 0.7 + multiNodeStrength;
  
  return clamp(nodeStrength, 0.0, 1.0);
}

// ----------------------------------------------------------------------------
// Shape Functions (Signed Distance Functions)
// ----------------------------------------------------------------------------
float sphereShape(vec3 pos) {
  return length(pos) - 2.0;
}

float cubeShape(vec3 pos) {
  vec3 q = abs(pos) - vec3(1.6, 1.6, 1.6);
  return max(q.x, max(q.y, q.z));
}

float torusShape(vec3 pos) {
  vec2 t = vec2(1.5, 0.5);
  vec2 q = vec2(length(pos.xz) - t.x, pos.y);
  return length(q) - t.y;
}

float octahedronShape(vec3 pos) {
  pos = abs(pos);
  return (pos.x + pos.y + pos.z - 1.8) * 0.577;
}

float teardropShape(vec3 pos) {
  // Teardrop: sphere at top transitioning to point at bottom
  // Scale to match other shapes
  vec3 p = pos * 0.8;
  
  // Top sphere part (upper hemisphere)
  float sphereRadius = 1.0;
  float sphereCenter = 0.5;
  float sphereDist = length(p - vec3(0.0, sphereCenter, 0.0)) - sphereRadius;
  
  // Bottom cone/point part
  // Create a smooth transition from sphere to point
  float y = p.y;
  float xzDist = length(p.xz);
  
  // Cone that tapers to a point
  float coneTop = -0.5;
  float coneBottom = -1.5;
  float coneTopRadius = 0.7;
  
  // Distance to cone surface
  float coneY = y - coneTop;
  float coneProgress = clamp((y - coneTop) / (coneBottom - coneTop), 0.0, 1.0);
  float coneRadius = mix(coneTopRadius, 0.0, coneProgress);
  
  // Cone distance field
  float coneDist = length(vec2(xzDist, 0.0)) - coneRadius;
  coneDist = max(coneDist, -(y - coneBottom)); // Cap at bottom
  
  // Smooth union of sphere and cone
  float k = 0.3; // Smoothing factor
  float h = clamp(0.5 + 0.5 * (coneDist - sphereDist) / k, 0.0, 1.0);
  return mix(coneDist, sphereDist, h) - k * h * (1.0 - h);
}

// ----------------------------------------------------------------------------
// Shape Morphing
// ----------------------------------------------------------------------------
float smoothInterpolate(float t) {
  // Triple smoothstep for ultra-smooth transitions
  // Ensure t is clamped to [0, 1] for guaranteed continuity
  t = clamp(t, 0.0, 1.0);
  
  // Triple smoothstep ensures C2 continuity (smooth second derivative)
  float s1 = smoothstep(0.0, 1.0, t);
  float s2 = smoothstep(0.0, 1.0, s1);
  float s3 = smoothstep(0.0, 1.0, s2);
  
  // Verify exact boundary conditions
  // At t=0: s1=0, s2=0, s3=0 -> returns 0.0
  // At t=1: s1=1, s2=1, s3=1 -> returns 1.0
  return s3;
}

float morphShape(vec3 pos, float morph) {
  // Updated cycle: sphere -> cube -> torus -> octahedron -> teardrop -> sphere
  float cycle = mod(morph, 5.0);
  
  // Calculate all shape distances once
  float sphere = sphereShape(pos);
  float cube = cubeShape(pos);
  float torus = torusShape(pos);
  float octahedron = octahedronShape(pos);
  float teardrop = teardropShape(pos);
  
  // Direct segment-based morphing with smooth boundaries
  // Calculate t for each segment independently
  float t0 = clamp(cycle - 0.0, 0.0, 1.0);
  float t1 = clamp(cycle - 1.0, 0.0, 1.0);
  float t2 = clamp(cycle - 2.0, 0.0, 1.0);
  float t3 = clamp(cycle - 3.0, 0.0, 1.0);
  // t4: no special wrap-around needed since w4 is not active at cycle 0.0
  // At cycle = 4.999, t4 ≈ 0.999, shape4 ≈ sphere
  // At cycle = 0.0, w4 = 0.0 (not active), so t4 value doesn't matter
  float t4 = clamp(cycle - 4.0, 0.0, 1.0);
  
  // Calculate smooth weights with proper segment coverage
  // CRITICAL: Each weight must be active for its ENTIRE segment, with overlap at boundaries
  // w0 covers cycle 0.0-1.0 (sphere→cube), fading out at 0.8-1.2 to hand off to w1
  // w1 covers cycle 1.0-2.0 (cube→torus), fading in at 0.8-1.2, out at 1.8-2.2
  // etc.
  float w0 = 1.0 - smoothstep(0.8, 1.2, cycle);  // Active for cycle 0.0-1.0, fades at 0.8-1.2
  float w1 = smoothstep(0.8, 1.2, cycle) * (1.0 - smoothstep(1.8, 2.2, cycle));  // Active for cycle 1.0-2.0
  float w2 = smoothstep(1.8, 2.2, cycle) * (1.0 - smoothstep(2.8, 3.2, cycle));  // Active for cycle 2.0-3.0
  float w3 = smoothstep(2.8, 3.2, cycle) * (1.0 - smoothstep(3.8, 4.2, cycle));  // Active for cycle 3.0-4.0
  float w4 = smoothstep(3.8, 4.2, cycle);  // Active for cycle 4.0-5.0
  // Wrap-around continuity: at cycle=4.999, w4=1.0 gives sphere
  // At cycle=0.001, w0=1.0 gives sphere. Both produce sphere at the boundary!
  
  // Normalize weights to ensure they sum to exactly 1.0
  float weightSum = w0 + w1 + w2 + w3 + w4;
  weightSum = max(weightSum, 0.0001);
  w0 /= weightSum;
  w1 /= weightSum;
  w2 /= weightSum;
  w3 /= weightSum;
  w4 /= weightSum;
  
  // Calculate shapes for each segment using correct t values
  // Critical: At boundaries, adjacent segments must produce the same shape
  // At cycle=1.0: t0=1.0 gives cube, t1=0.0 gives cube - both match!
  float interp0 = smoothInterpolate(t0);
  float interp1 = smoothInterpolate(t1);
  float interp2 = smoothInterpolate(t2);
  float interp3 = smoothInterpolate(t3);
  float interp4 = smoothInterpolate(t4);
  
  float shape0 = mix(sphere, cube, interp0);
  float shape1 = mix(cube, torus, interp1);
  float shape2 = mix(torus, octahedron, interp2);
  float shape3 = mix(octahedron, teardrop, interp3);
  float shape4 = mix(teardrop, sphere, interp4);
  
  // Blend all transitions - weights ensure smooth transitions at boundaries
  return w0 * shape0 + w1 * shape1 + w2 * shape2 + w3 * shape3 + w4 * shape4;
}

