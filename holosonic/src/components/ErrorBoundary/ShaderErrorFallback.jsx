// ============================================================================
// SHADER ERROR FALLBACK
// ============================================================================
// Fallback visualization when shaders fail to compile

import React from 'react';
import { Mesh } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Simple fallback visualization when shaders fail
 * Shows a basic wireframe sphere with a simple material
 */
function ShaderErrorFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2.0, 32, 32]} />
      <meshBasicMaterial
        color="#40e0d0"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default ShaderErrorFallback;

