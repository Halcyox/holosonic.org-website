// ============================================================================
// PARTICLE SWARM COMPONENT (REFACTORED EXAMPLE)
// ============================================================================
// This is an example of how ParticleSwarm would look after refactoring
// to use configuration modules and custom hooks

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { GEOMETRY, MATERIAL } from '../../config';
import { useAnimation } from './hooks/useAnimation';
import './PressureFieldMaterial';

/**
 * ParticleSwarm Component
 * 
 * 3D visualization of acoustic pressure field for sono printing.
 * Displays a volumetric field that morphs between different shapes.
 * 
 * @example
 * ```jsx
 * <ParticleSwarm />
 * ```
 */
function ParticleSwarm() {
  const meshRef = useRef();
  const fieldRef = useRef();

  // Use configuration for geometry parameters
  const fieldGeometry = useMemo(() => {
    return new THREE.SphereGeometry(
      GEOMETRY.SPHERE.RADIUS,
      GEOMETRY.SPHERE.SEGMENTS,
      GEOMETRY.SPHERE.SEGMENTS
    );
  }, []);

  // Use custom hook for animation logic
  useAnimation({ fieldRef, meshRef });

  return (
    <group ref={meshRef}>
      <mesh ref={fieldRef} geometry={fieldGeometry}>
        <pressureFieldMaterial
          attach="material"
          color={MATERIAL.COLOR}
          time={0}
          shapeMorph={MATERIAL.INITIAL_MORPH || 1.0}
          transparent={MATERIAL.TRANSPARENT}
          blending={THREE[MATERIAL.BLENDING]}
          depthWrite={MATERIAL.DEPTH_WRITE}
          side={THREE[MATERIAL.SIDE]}
        />
      </mesh>
    </group>
  );
}

export default ParticleSwarm;

