// ============================================================================
// SHAPE MORPHING MODULE
// ============================================================================
// Smooth interpolation and shape blending functions

// Triple smoothstep for ultra-smooth transitions (C2 continuity)
float smoothInterpolate(float t) {
  t = clamp(t, 0.0, 1.0);
  float s1 = smoothstep(0.0, 1.0, t);
  float s2 = smoothstep(0.0, 1.0, s1);
  float s3 = smoothstep(0.0, 1.0, s2);
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
  float t4 = clamp(cycle - 4.0, 0.0, 1.0);
  
  // Calculate smooth weights with proper segment coverage
  // CRITICAL: Each weight must be active for its ENTIRE segment, with overlap at boundaries
  float w0 = 1.0 - smoothstep(0.8, 1.2, cycle);  // Active for cycle 0.0-1.0, fades at 0.8-1.2
  float w1 = smoothstep(0.8, 1.2, cycle) * (1.0 - smoothstep(1.8, 2.2, cycle));  // Active for cycle 1.0-2.0
  float w2 = smoothstep(1.8, 2.2, cycle) * (1.0 - smoothstep(2.8, 3.2, cycle));  // Active for cycle 2.0-3.0
  float w3 = smoothstep(2.8, 3.2, cycle) * (1.0 - smoothstep(3.8, 4.2, cycle));  // Active for cycle 3.0-4.0
  float w4 = smoothstep(3.8, 4.2, cycle);  // Active for cycle 4.0-5.0
  
  // Normalize weights to ensure they sum to exactly 1.0
  float weightSum = w0 + w1 + w2 + w3 + w4;
  weightSum = max(weightSum, 0.0001);
  w0 /= weightSum;
  w1 /= weightSum;
  w2 /= weightSum;
  w3 /= weightSum;
  w4 /= weightSum;
  
  // Calculate shapes for each segment using correct t values
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

