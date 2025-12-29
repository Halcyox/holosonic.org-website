// ============================================================================
// FRAGMENT SHADER MAIN
// ============================================================================
// Handles lighting, coloring, and volumetric effects

uniform float time;
uniform float shapeMorph;
uniform vec3 color;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying float vShapeFactor;

void main() {
  vec3 pos = vWorldPosition;
  float pressure = calculatePressure(pos, time);
  float nodeStrength = calculateNodeStrength(pos, time);
  float materialAccumulation = pow(nodeStrength, 1.5);
  
  vec3 viewDir = normalize(vViewPosition);
  float fresnelSchlick = calculateFresnel(vNormal, viewDir);
  float rimIntensity = fresnelSchlick * (1.0 + materialAccumulation * 0.5 + abs(pressure) * 0.2);
  
  float lighting = calculateTotalLighting(vNormal, viewDir, materialAccumulation, pressure, vDisplacement, time);
  
  // Field intensity
  float baseIntensity = 1.0 - abs(pressure) * 0.5;
  float fieldIntensity = baseIntensity * 0.7 + materialAccumulation * 0.5 + 0.3;
  
  // Depth-based effects
  float depth = length(vPosition);
  float depthFade = smoothstep(1.2, 2.2, depth);
  float atmosphericFade = smoothstep(1.5, 2.5, depth);
  vec3 atmosphericTint = mix(vec3(1.0), vec3(0.7, 0.85, 1.0), atmosphericFade);
  float volumetricDepth = smoothstep(1.8, 2.5, depth);
  float displacementContrast = smoothstep(0.0, 0.12, abs(vDisplacement) * 2.0);
  
  // Final lighting integration
  float shapeIntensity = rimIntensity * lighting * (0.75 + displacementContrast * 0.25) * (0.8 + depthFade * 0.2);
  shapeIntensity *= (1.0 - volumetricDepth * 0.15);
  fieldIntensity *= shapeIntensity;
  
  // Physics-based coloring
  vec3 physicsColor = calculatePhysicsColor(pressure, materialAccumulation, vShapeFactor, vDisplacement, color);
  
  // Color lighting integration
  vec3 keyLightDir = normalize(vec3(0.8, 1.2, 0.6));
  vec3 fillLightDir = normalize(vec3(-0.6, -0.4, -0.8));
  float keyDiffuse = calculateKeyLight(vNormal, keyLightDir);
  float fillDiffuse = calculateFillLight(vNormal, fillLightDir);
  float rimLight = calculateRimLight(vNormal, viewDir);
  float specular = calculateSpecular(vNormal, viewDir, keyLightDir, materialAccumulation, pressure);
  
  vec3 litColor = physicsColor * lighting;
  vec3 warmTint = vec3(1.0, 0.98, 0.95) * keyDiffuse * 0.7;
  vec3 coolTint = vec3(0.9, 0.95, 1.0) * fillDiffuse;
  vec3 lightColorMix = mix(coolTint, warmTint, keyDiffuse);
  litColor = mix(litColor, litColor * lightColorMix, 0.3);
  
  float displacementMix = (smoothstep(-0.001, 0.001, vDisplacement) * 2.0 - 1.0) * 0.5 + 0.5;
  displacementMix = displacementMix * displacementContrast * 0.4 + 0.6;
  vec3 displacedColor = mix(litColor * 0.92, litColor * 1.15, displacementMix);
  displacedColor *= atmosphericTint;
  
  vec3 specularColor = mix(vec3(1.0, 0.98, 0.95), vec3(0.95, 0.98, 1.0), abs(pressure) * 0.3);
  displacedColor += specularColor * specular * 0.25;
  
  // Rim color
  vec3 rimTint = calculateRimColor(vNormal, vViewPosition, fresnelSchlick, materialAccumulation, pressure);
  float rimBlend = fresnelSchlick * (0.6 + materialAccumulation * 0.2 + abs(pressure) * 0.1);
  vec3 rimColor = mix(displacedColor, rimTint, rimBlend);
  rimColor += vec3(0.95, 0.98, 1.0) * rimLight * (0.4 + materialAccumulation * 0.2);
  
  // Node glow
  vec3 nodeGlow = calculateNodeGlow(materialAccumulation, time);
  rimColor += nodeGlow;
  
  // Volumetric scattering
  float fresnel = 1.0 - abs(dot(vNormal, viewDir));
  float scattering = pow(fresnel, 0.4) * (1.0 - abs(pressure) * 0.25);
  vec3 scatteringColor = mix(vec3(0.25, 0.65, 1.0), vec3(0.4, 0.75, 1.0), materialAccumulation * 0.4);
  rimColor += scatteringColor * scattering * (0.2 + materialAccumulation * 0.1);
  
  // Final color
  vec3 fieldColor = rimColor * fieldIntensity;
  
  // Pulsing effects
  float pulsing = calculatePulsing(time, pressure, materialAccumulation);
  fieldColor *= pulsing;
  
  // Node highlight
  vec3 nodeColor = mix(mix(color * 1.6, vec3(0.6, 0.95, 1.0), 0.3), vec3(0.85, 1.0, 1.0), smoothstep(0.3, 1.0, materialAccumulation));
  float nodePulse = sin(time * 2.0 + materialAccumulation * 3.14) * 0.08 + 0.92;
  float nodePulse2 = cos(time * 2.4 + materialAccumulation * 4.71) * 0.04;
  float nodePulse3 = sin(time * 1.6 + materialAccumulation * 5.0) * 0.03;
  vec3 nodeHighlight = nodeColor * materialAccumulation * (nodePulse + nodePulse2 + nodePulse3);
  fieldColor += nodeHighlight * (0.25 + materialAccumulation * 0.1);
  
  float alpha = max(fieldIntensity * 0.9, 0.4);
  gl_FragColor = vec4(fieldColor, alpha);
}
