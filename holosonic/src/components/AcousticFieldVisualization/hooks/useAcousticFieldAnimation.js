// ============================================================================
// ACOUSTIC FIELD ANIMATION HOOK
// ============================================================================
// Custom hook for managing acoustic field visualization animation state and updates

import { useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { MORPHING_CONFIG, ROTATION_CONFIG } from '../../../config';

/**
 * Custom hook for managing acoustic field visualization animations
 * 
 * Handles shader uniform updates and mesh rotation based on time.
 * 
 * @param {Object} refs - Object containing mesh references
 * @param {React.RefObject} refs.fieldMeshRef - Ref to the field mesh
 * @param {React.RefObject} refs.containerGroupRef - Ref to the parent group (optional)
 * 
 * @returns {Object} Animation control functions for potential external control
 */
export function useAcousticFieldAnimation(refs) {
  const { fieldMeshRef, containerGroupRef } = refs;
  
  /**
   * Update shader uniforms with current time and morph value
   */
  const updateShaderUniforms = useCallback((time) => {
    if (fieldMeshRef.current?.material) {
      fieldMeshRef.current.material.uniforms.time.value = time;
      fieldMeshRef.current.material.uniforms.shapeMorph.value = MORPHING_CONFIG.calculateMorph(time);
    }
  }, [fieldMeshRef]);
  
  /**
   * Update mesh rotation based on time
   */
  const updateMeshRotation = useCallback((time) => {
    if (fieldMeshRef.current) {
      const rotation = ROTATION_CONFIG.calculateAll(time);
      fieldMeshRef.current.rotation.x = rotation.x;
      fieldMeshRef.current.rotation.y = rotation.y;
      fieldMeshRef.current.rotation.z = rotation.z;
    }
  }, [fieldMeshRef]);
  
  /**
   * Main animation loop - updates every frame
   */
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    updateShaderUniforms(time);
    updateMeshRotation(time);
  });
  
  // Return control functions for potential external control
  return {
    updateShaderUniforms,
    updateMeshRotation,
  };
}

