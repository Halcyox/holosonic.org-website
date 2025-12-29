// ============================================================================
// ACOUSTIC FIELD MATERIAL
// ============================================================================
// Custom shader material for volumetric acoustic pressure field visualization
// Handles morphing geometries and physically-based lighting

import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIAL } from '../../config';
import { getVertexShader, getFragmentShader } from './shaders/loadShader.js';

/**
 * AcousticFieldMaterial
 * 
 * Custom shader material that visualizes acoustic pressure fields with:
 * - Shape morphing between multiple geometries
 * - Physically-based lighting
 * - Volumetric field visualization
 */
const AcousticFieldMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(MATERIAL.COLOR),
    shapeMorph: 0.0,
  },
  getVertexShader(),
  getFragmentShader()
);

extend({ AcousticFieldMaterial });

export default AcousticFieldMaterial;

