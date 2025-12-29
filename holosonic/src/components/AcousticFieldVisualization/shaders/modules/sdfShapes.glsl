// ============================================================================
// SDF SHAPES MODULE
// ============================================================================
// Signed Distance Functions for geometric primitives

// Smooth minimum function for blending SDFs
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

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
  // Ultra-slender Rounded Cone SDF
  // High-aspect-ratio teardrop with sharp point
  
  vec3 p = pos + vec3(0.0, 1.5, 0.0);
  
  float r1 = 1.1;    // Bottom bulb radius
  float r2 = 0.001;  // Top tip radius (needle sharp)
  float h = 5.0;     // Total height
  
  vec2 q = vec2(length(p.xz), p.y);
  
  // Euclidean Rounded Cone SDF
  float b = (r1 - r2) / h;
  float a = sqrt(1.0 - b * b);
  float k = dot(q, vec2(-a, b));
  
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
      
  return dot(q, vec2(b, a)) - r1;
}

