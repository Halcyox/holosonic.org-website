// ============================================================================
// ACOUSTIC FIELD VISUALIZATION COMPONENT
// ============================================================================
// 3D volumetric visualization of acoustic pressure field for sono printing
// Displays morphing geometries representing material accumulation in pressure nodes

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { GEOMETRY, MATERIAL, SHAPE_MORPHING } from '../../config';
import { useAcousticFieldAnimation } from './hooks/useAcousticFieldAnimation.js';
import './AcousticFieldMaterial.js';

/**
 * AcousticFieldVisualization Component
 * 
 * Renders a 3D volumetric visualization of an acoustic pressure field that
 * morphs between different geometric shapes, representing the dynamic nature
 * of acoustic levitation and material manipulation.
 * 
 * @returns {JSX.Element} React Three Fiber mesh with custom shader material
 */
function AcousticFieldVisualization() {
  const containerGroupRef = useRef();
  const fieldMeshRef = useRef();

  // Create geometry once using configuration
  const fieldGeometry = useMemo(() => {
    return new THREE.SphereGeometry(
      GEOMETRY.SPHERE.RADIUS,
      GEOMETRY.SPHERE.SEGMENTS,
      GEOMETRY.SPHERE.SEGMENTS
    );
  }, []);

  // Handle animation updates using custom hook
  useAcousticFieldAnimation({
    fieldMeshRef,
    containerGroupRef,
  });

  return (
    <group ref={containerGroupRef}>
      <mesh ref={fieldMeshRef} geometry={fieldGeometry}>
        <acousticFieldMaterial
          attach="material"
          color={MATERIAL.COLOR}
          time={0}
          shapeMorph={SHAPE_MORPHING.INITIAL_VALUE}
          transparent={MATERIAL.TRANSPARENT}
          blending={THREE[MATERIAL.BLENDING]}
          depthWrite={MATERIAL.DEPTH_WRITE}
          side={THREE[MATERIAL.SIDE]}
        />
      </mesh>
    </group>
  );
}

export default AcousticFieldVisualization;
