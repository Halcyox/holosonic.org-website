// ============================================================================
// FRAGMENT SHADER
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

// Common functions would be included here - see common.glsl

void main() {
  vec3 pos = vWorldPosition;
  float pressure = calculatePressure(pos, time);
  float nodeStrength = calculateNodeStrength(pos, time);
  
  // Material accumulation at pressure nodes
  float materialAccumulation = pow(nodeStrength, 1.5);
  
  // Field intensity
  float baseIntensity = 1.0 - abs(pressure) * 0.5;
  float fieldIntensity = baseIntensity * 0.7 + materialAccumulation * 0.5 + 0.3;
  
  // Lighting system
  vec3 viewDir = normalize(vViewPosition);
  
  // Fresnel effect
  float NdotV = abs(dot(vNormal, viewDir));
  float fresnel = 1.0 - NdotV;
  float F0 = 0.04;
  float fresnelSchlick = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);
  float rimIntensity = fresnelSchlick * (1.0 + materialAccumulation * 0.5 + abs(pressure) * 0.2);
  float chromaticFresnel = pow(fresnel, 0.6);
  
  // Subsurface scattering
  float subsurface = pow(1.0 - NdotV, 2.0) * (0.3 + materialAccumulation * 0.4);
  vec3 subsurfaceColor = mix(
    vec3(0.3, 0.7, 1.0),
    vec3(0.5, 0.9, 1.0),
    materialAccumulation * 0.6
  );
  
  // Key light
  vec3 keyLightDir = normalize(vec3(0.8, 1.2, 0.6));
  float NdotL_key = max(dot(vNormal, keyLightDir), 0.0);
  float keyDiffuse = pow(NdotL_key, 0.9);
  float keyIntensity = 0.7;
  vec3 keyColor = vec3(1.0, 0.98, 0.95);
  
  // Fill light
  vec3 fillLightDir = normalize(vec3(-0.6, -0.4, -0.8));
  float NdotL_fill = max(dot(vNormal, fillLightDir), 0.0);
  float fillDiffuse = pow(NdotL_fill, 1.5) * 0.4;
  vec3 fillColor = vec3(0.9, 0.95, 1.0);
  
  // Rim light
  vec3 rimLightDir = normalize(-viewDir + vNormal * 0.6);
  float NdotL_rim = max(dot(vNormal, rimLightDir), 0.0);
  float rimLight = pow(NdotL_rim, 2.0) * 0.5;
  vec3 rimColor_light = vec3(0.95, 0.98, 1.0);
  
  // Specular highlight
  vec3 halfVector = normalize(keyLightDir + viewDir);
  float NdotH = max(dot(vNormal, halfVector), 0.0);
  float roughness = mix(0.25, 0.4, materialAccumulation * 0.5);
  float specularPower = 2.0 / (roughness * roughness) - 2.0;
  float specular = pow(NdotH, specularPower);
  float specularIntensity = 0.5 * (1.0 - materialAccumulation * 0.2) * (1.0 + abs(pressure) * 0.1);
  specular *= specularIntensity;
  vec3 specularColor = mix(
    vec3(1.0, 0.98, 0.95),
    vec3(0.95, 0.98, 1.0),
    abs(pressure) * 0.3
  );
  
  // Ambient light
  float ambientBase = 0.35;
  float ao = 1.0 - abs(vDisplacement) * 0.3;
  ambientBase *= ao;
  
  // Combine lighting
  vec3 totalLight = vec3(0.0);
  totalLight += keyColor * keyDiffuse * keyIntensity;
  totalLight += fillColor * fillDiffuse;
  totalLight += rimColor_light * rimLight;
  totalLight += specularColor * specular;
  totalLight += subsurfaceColor * subsurface;
  totalLight += vec3(ambientBase);
  
  float lighting = (totalLight.r + totalLight.g + totalLight.b) / 3.0;
  lighting = pow(lighting, 0.8);
  
  // Dynamic lighting variations
  float pressureVariation = sin(time * 0.5 + pressure * 1.5) * 0.03;
  lighting += pressureVariation;
  lighting *= (1.0 + materialAccumulation * 0.15);
  
  // Displacement-based lighting
  float displacementFactor = abs(vDisplacement) * 2.0;
  float displacementContrast = smoothstep(0.0, 0.12, displacementFactor);
  float displacementLighting = 1.0 + displacementContrast * 0.2;
  lighting *= displacementLighting;
  
  // Depth-based effects
  float depth = length(vPosition);
  float depthFade = smoothstep(1.2, 2.2, depth);
  float atmosphericFade = smoothstep(1.5, 2.5, depth);
  vec3 atmosphericTint = mix(vec3(1.0), vec3(0.7, 0.85, 1.0), atmosphericFade);
  float volumetricDepth = smoothstep(1.8, 2.5, depth);
  
  // Final lighting integration
  float shapeIntensity = rimIntensity * lighting * (0.75 + displacementContrast * 0.25) * (0.8 + depthFade * 0.2);
  shapeIntensity *= (1.0 - volumetricDepth * 0.15);
  fieldIntensity *= shapeIntensity;
  
  // Physics-based coloring
  // Use smooth, continuous sign approximation
  // This avoids the discontinuity from sign() at zero
  // Use a smoothstep-based approximation that's continuous everywhere
  float smoothSign = smoothstep(-0.001, 0.001, vDisplacement) * 2.0 - 1.0;
  // For very small values, this gives a smooth transition
  // For larger values, it approaches ±1 smoothly
  float displacementMix = (smoothSign * 0.5 + 0.5) * displacementContrast * 0.4 + 0.6;
  
  // Color gradients
  vec3 nodeColor = mix(
    mix(color * 1.6, vec3(0.6, 0.95, 1.0), 0.3),
    vec3(0.85, 1.0, 1.0),
    smoothstep(0.3, 1.0, materialAccumulation)
  );
  
  vec3 pressureColor = mix(
    color * 0.75,
    mix(vec3(0.2, 0.5, 0.85), vec3(0.15, 0.4, 0.8), abs(pressure)),
    smoothstep(0.2, 1.0, abs(pressure))
  );
  
  float shapeT = sin(vShapeFactor * 3.14159) * 0.5 + 0.5;
  vec3 shapeColor = mix(
    color,
    mix(
      vec3(0.45, 0.88, 1.0),
      vec3(0.65, 0.85, 1.0),
      shapeT
    ),
    smoothstep(0.0, 1.0, vShapeFactor * 0.4)
  );
  
  vec3 physicsColor = mix(
    pressureColor,
    nodeColor,
    smoothstep(0.2, 0.8, materialAccumulation)
  );
  
  physicsColor = mix(
    physicsColor,
    shapeColor,
    smoothstep(0.1, 0.6, vShapeFactor) * 0.3
  );
  
  float displacementColorShift = vDisplacement * 0.3;
  physicsColor = mix(
    physicsColor,
    physicsColor * vec3(0.9, 1.1, 1.0),
    displacementColorShift * 0.5 + 0.5
  );
  
  // Color lighting integration
  vec3 litColor = physicsColor * lighting;
  vec3 warmTint = keyColor * keyDiffuse * keyIntensity;
  vec3 coolTint = fillColor * fillDiffuse;
  vec3 lightColorMix = mix(coolTint, warmTint, keyDiffuse);
  litColor = mix(litColor, litColor * lightColorMix, 0.3);
  
  vec3 displacedColor = mix(litColor * 0.92, litColor * 1.15, displacementMix);
  displacedColor *= atmosphericTint;
  displacedColor += specularColor * specular * 0.25;
  
  // Rim color
  vec3 rimTint = mix(
    mix(
      vec3(0.5, 0.9, 1.0),
      vec3(0.4, 0.85, 1.0),
      chromaticFresnel * 0.5
    ),
    mix(
      vec3(0.85, 0.95, 1.0),
      vec3(0.9, 0.98, 1.0),
      chromaticFresnel * 0.3
    ),
    chromaticFresnel
  );
  
  float rimBlend = fresnelSchlick * (0.6 + materialAccumulation * 0.2 + abs(pressure) * 0.1);
  vec3 rimColor = mix(displacedColor, rimTint, rimBlend);
  rimColor += rimColor_light * rimLight * (0.4 + materialAccumulation * 0.2);
  
  // Node glow
  float nodeGlowIntensity = materialAccumulation * (0.5 + sin(time * 1.0 + materialAccumulation * 6.28) * 0.15);
  vec3 nodeGlow = mix(
    mix(vec3(0.35, 0.85, 1.0), vec3(0.5, 0.95, 1.0), materialAccumulation * 0.5),
    vec3(0.7, 1.0, 1.0),
    smoothstep(0.5, 1.0, materialAccumulation)
  ) * nodeGlowIntensity;
  rimColor += nodeGlow;
  
  // Volumetric scattering
  float scattering = pow(fresnel, 0.4) * (1.0 - abs(pressure) * 0.25);
  vec3 scatteringColor = mix(
    vec3(0.25, 0.65, 1.0),
    vec3(0.4, 0.75, 1.0),
    materialAccumulation * 0.4
  );
  rimColor += scatteringColor * scattering * (0.2 + materialAccumulation * 0.1);
  
  // Final color
  vec3 fieldColor = rimColor * fieldIntensity;
  
  // Pulsing
  float pulse = sin(time * 2.0) * 0.08 + sin(time * 3.5) * 0.04 + sin(time * 1.2) * 0.06 + 0.9;
  float pulse2 = sin(time * 2.5) * 0.025 + cos(time * 3.0) * 0.015;
  float pulse3 = sin(time * 1.8 + pressure * 2.0) * 0.02;
  fieldColor *= pulse * (1.0 + pulse2 + pulse3);
  
  float materialPulse = sin(time * 1.5) * 0.12 + 1.0;
  float materialPulse2 = cos(time * 1.75) * 0.06;
  float materialPulse3 = sin(time * 2.2 + materialAccumulation * 4.0) * 0.04;
  fieldColor *= (0.88 + materialAccumulation * (materialPulse + materialPulse2 + materialPulse3) * 0.12);
  
  vec3 pressureShift = mix(
    vec3(0.92, 1.08, 1.0),
    vec3(0.88, 1.12, 1.05),
    abs(pressure)
  );
  fieldColor = mix(fieldColor, fieldColor * pressureShift, smoothstep(0.1, 0.8, abs(pressure)) * 0.3);
  
  float nodePulse = sin(time * 2.0 + materialAccumulation * 3.14) * 0.08 + 0.92;
  float nodePulse2 = cos(time * 2.4 + materialAccumulation * 4.71) * 0.04;
  float nodePulse3 = sin(time * 1.6 + materialAccumulation * 5.0) * 0.03;
  vec3 nodeHighlight = nodeColor * materialAccumulation * (nodePulse + nodePulse2 + nodePulse3);
  fieldColor += nodeHighlight * (0.25 + materialAccumulation * 0.1);
  
  float alpha = max(fieldIntensity * 0.9, 0.4);
  gl_FragColor = vec4(fieldColor, alpha);
}

