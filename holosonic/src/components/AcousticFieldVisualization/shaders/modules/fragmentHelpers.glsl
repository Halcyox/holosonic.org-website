// ============================================================================
// FRAGMENT SHADER HELPER FUNCTIONS
// ============================================================================

// Calculate Fresnel effect
float calculateFresnel(vec3 normal, vec3 viewDir) {
  float NdotV = abs(dot(normal, viewDir));
  float F0 = 0.04;
  return F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);
}

// Calculate subsurface scattering
float calculateSubsurfaceScattering(vec3 normal, vec3 viewDir, float materialAccumulation) {
  float NdotV = abs(dot(normal, viewDir));
  return pow(1.0 - NdotV, 2.0) * (0.3 + materialAccumulation * 0.4);
}

// Calculate key light contribution
float calculateKeyLight(vec3 normal, vec3 lightDir) {
  float NdotL = max(dot(normal, lightDir), 0.0);
  return pow(NdotL, 0.9);
}

// Calculate fill light contribution
float calculateFillLight(vec3 normal, vec3 lightDir) {
  float NdotL = max(dot(normal, lightDir), 0.0);
  return pow(NdotL, 1.5) * 0.4;
}

// Calculate rim light contribution
float calculateRimLight(vec3 normal, vec3 viewDir) {
  vec3 rimLightDir = normalize(-viewDir + normal * 0.6);
  float NdotL = max(dot(normal, rimLightDir), 0.0);
  return pow(NdotL, 2.0) * 0.5;
}

// Calculate specular highlight
float calculateSpecular(vec3 normal, vec3 viewDir, vec3 lightDir, float materialAccumulation, float pressure) {
  vec3 halfVector = normalize(lightDir + viewDir);
  float NdotH = max(dot(normal, halfVector), 0.0);
  float roughness = mix(0.25, 0.4, materialAccumulation * 0.5);
  float specularPower = 2.0 / (roughness * roughness) - 2.0;
  float specular = pow(NdotH, specularPower);
  float specularIntensity = 0.5 * (1.0 - materialAccumulation * 0.2) * (1.0 + abs(pressure) * 0.1);
  return specular * specularIntensity;
}

// Calculate combined lighting
float calculateTotalLighting(vec3 normal, vec3 viewDir, float materialAccumulation, float pressure, float displacement, float time) {
  vec3 keyLightDir = normalize(vec3(0.8, 1.2, 0.6));
  vec3 fillLightDir = normalize(vec3(-0.6, -0.4, -0.8));
  
  float keyDiffuse = calculateKeyLight(normal, keyLightDir);
  float fillDiffuse = calculateFillLight(normal, fillLightDir);
  float rimLight = calculateRimLight(normal, viewDir);
  float specular = calculateSpecular(normal, viewDir, keyLightDir, materialAccumulation, pressure);
  float subsurface = calculateSubsurfaceScattering(normal, viewDir, materialAccumulation);
  
  float ambientBase = 0.35;
  float ao = 1.0 - abs(displacement) * 0.3;
  ambientBase *= ao;
  
  vec3 totalLight = vec3(0.0);
  totalLight += vec3(1.0, 0.98, 0.95) * keyDiffuse * 0.7;
  totalLight += vec3(0.9, 0.95, 1.0) * fillDiffuse;
  totalLight += vec3(0.95, 0.98, 1.0) * rimLight;
  totalLight += vec3(1.0, 0.98, 0.95) * specular;
  totalLight += mix(vec3(0.3, 0.7, 1.0), vec3(0.5, 0.9, 1.0), materialAccumulation * 0.6) * subsurface;
  totalLight += vec3(ambientBase);
  
  float lighting = (totalLight.r + totalLight.g + totalLight.b) / 3.0;
  lighting = pow(lighting, 0.8);
  
  // Dynamic variations
  float pressureVariation = sin(time * 0.5 + pressure * 1.5) * 0.03;
  lighting += pressureVariation;
  lighting *= (1.0 + materialAccumulation * 0.15);
  
  // Displacement-based lighting
  float displacementFactor = abs(displacement) * 2.0;
  float displacementContrast = smoothstep(0.0, 0.12, displacementFactor);
  lighting *= (1.0 + displacementContrast * 0.2);
  
  return lighting;
}

// Calculate physics-based color
vec3 calculatePhysicsColor(float pressure, float materialAccumulation, float shapeFactor, float displacement, vec3 baseColor) {
  // Smooth sign approximation for displacement
  float smoothSign = smoothstep(-0.001, 0.001, displacement) * 2.0 - 1.0;
  float displacementContrast = smoothstep(0.0, 0.12, abs(displacement) * 2.0);
  float displacementMix = (smoothSign * 0.5 + 0.5) * displacementContrast * 0.4 + 0.6;
  
  // Color gradients
  vec3 nodeColor = mix(
    mix(baseColor * 1.6, vec3(0.6, 0.95, 1.0), 0.3),
    vec3(0.85, 1.0, 1.0),
    smoothstep(0.3, 1.0, materialAccumulation)
  );
  
  vec3 pressureColor = mix(
    baseColor * 0.75,
    mix(vec3(0.2, 0.5, 0.85), vec3(0.15, 0.4, 0.8), abs(pressure)),
    smoothstep(0.2, 1.0, abs(pressure))
  );
  
  float shapeT = sin(shapeFactor * 3.14159) * 0.5 + 0.5;
  vec3 shapeColor = mix(
    baseColor,
    mix(vec3(0.45, 0.88, 1.0), vec3(0.65, 0.85, 1.0), shapeT),
    smoothstep(0.0, 1.0, shapeFactor * 0.4)
  );
  
  vec3 physicsColor = mix(pressureColor, nodeColor, smoothstep(0.2, 0.8, materialAccumulation));
  physicsColor = mix(physicsColor, shapeColor, smoothstep(0.1, 0.6, shapeFactor) * 0.3);
  
  float displacementColorShift = displacement * 0.3;
  physicsColor = mix(
    physicsColor,
    physicsColor * vec3(0.9, 1.1, 1.0),
    displacementColorShift * 0.5 + 0.5
  );
  
  return physicsColor;
}

// Calculate rim color with Fresnel
vec3 calculateRimColor(vec3 normal, vec3 viewPosition, float fresnel, float materialAccumulation, float pressure) {
  float chromaticFresnel = pow(1.0 - abs(dot(normal, normalize(viewPosition))), 0.6);
  
  vec3 rimTint = mix(
    mix(vec3(0.5, 0.9, 1.0), vec3(0.4, 0.85, 1.0), chromaticFresnel * 0.5),
    mix(vec3(0.85, 0.95, 1.0), vec3(0.9, 0.98, 1.0), chromaticFresnel * 0.3),
    chromaticFresnel
  );
  
  return rimTint;
}

// Calculate node glow effect
vec3 calculateNodeGlow(float materialAccumulation, float time) {
  float nodeGlowIntensity = materialAccumulation * (0.5 + sin(time * 1.0 + materialAccumulation * 6.28) * 0.15);
  return mix(
    mix(vec3(0.35, 0.85, 1.0), vec3(0.5, 0.95, 1.0), materialAccumulation * 0.5),
    vec3(0.7, 1.0, 1.0),
    smoothstep(0.5, 1.0, materialAccumulation)
  ) * nodeGlowIntensity;
}

// Calculate pulsing effects
float calculatePulsing(float time, float pressure, float materialAccumulation) {
  float pulse = sin(time * 2.0) * 0.08 + sin(time * 3.5) * 0.04 + sin(time * 1.2) * 0.06 + 0.9;
  float pulse2 = sin(time * 2.5) * 0.025 + cos(time * 3.0) * 0.015;
  float pulse3 = sin(time * 1.8 + pressure * 2.0) * 0.02;
  float materialPulse = sin(time * 1.5) * 0.12 + 1.0;
  float materialPulse2 = cos(time * 1.75) * 0.06;
  float materialPulse3 = sin(time * 2.2 + materialAccumulation * 4.0) * 0.04;
  
  return pulse * (1.0 + pulse2 + pulse3) * (0.88 + materialAccumulation * (materialPulse + materialPulse2 + materialPulse3) * 0.12);
}

