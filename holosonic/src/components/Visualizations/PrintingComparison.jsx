import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PrintingComparison - Side-by-side comparison of layer-by-layer vs volumetric printing
 */
function PrintingComparison() {
  const layerProgress = useRef(0);
  const volumetricProgress = useRef(0);
  const animationSpeed = 0.3;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    layerProgress.current = Math.min((time * animationSpeed) % 2, 1);
    volumetricProgress.current = Math.min((time * animationSpeed) % 2, 1);
  });

  // Create a simple cube shape to build
  const buildShape = (progress, isVolumetric) => {
    const size = 1.5;
    const segments = 8;
    const cubes = [];
    
    if (isVolumetric) {
      // Volumetric: build throughout volume simultaneously
      const totalCubes = segments * segments * segments;
      const cubesToShow = Math.floor(totalCubes * progress);
      
      for (let i = 0; i < cubesToShow; i++) {
        const x = (i % segments) - segments / 2;
        const y = Math.floor((i / segments) % segments) - segments / 2;
        const z = Math.floor(i / (segments * segments)) - segments / 2;
        
        cubes.push({
          position: [
            (x / segments) * size,
            (y / segments) * size,
            (z / segments) * size
          ],
          opacity: 0.8
        });
      }
    } else {
      // Layer-by-layer: build sequentially
      const layers = Math.floor(progress * segments);
      const currentLayerProgress = (progress * segments) % 1;
      
      for (let layer = 0; layer < layers; layer++) {
        for (let x = 0; x < segments; x++) {
          for (let z = 0; z < segments; z++) {
            cubes.push({
              position: [
                ((x - segments / 2) / segments) * size,
                ((layer - segments / 2) / segments) * size,
                ((z - segments / 2) / segments) * size
              ],
              opacity: 0.8
            });
          }
        }
      }
      
      // Current layer being built
      if (currentLayerProgress > 0 && layers < segments) {
        const cubesInLayer = Math.floor(currentLayerProgress * segments * segments);
        for (let i = 0; i < cubesInLayer; i++) {
          const x = i % segments;
          const z = Math.floor(i / segments);
          cubes.push({
            position: [
              ((x - segments / 2) / segments) * size,
              ((layers - segments / 2) / segments) * size,
              ((z - segments / 2) / segments) * size
            ],
            opacity: 0.5
          });
        }
      }
    }
    
    return cubes;
  };

  const layerCubes = buildShape(layerProgress.current, false);
  const volumetricCubes = buildShape(volumetricProgress.current, true);

  return (
    <group>
      {/* Layer-by-layer side */}
      <group position={[-2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 3, 3]} />
          <meshBasicMaterial color="#40e0d0" opacity={0.1} transparent />
        </mesh>
        {layerCubes.map((cube, i) => (
          <mesh key={`layer-${i}`} position={cube.position}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial 
              color="#40e0d0" 
              opacity={cube.opacity}
              transparent
              emissive="#40e0d0"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Volumetric side */}
      <group position={[2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 3, 3]} />
          <meshBasicMaterial color="#60c0ff" opacity={0.1} transparent />
        </mesh>
        {volumetricCubes.map((cube, i) => (
          <mesh key={`vol-${i}`} position={cube.position}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial 
              color="#60c0ff" 
              opacity={cube.opacity}
              transparent
              emissive="#60c0ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Labels */}
      <mesh position={[-2, -2, 0]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="#1a1f3a" opacity={0.8} transparent />
      </mesh>
      <mesh position={[2, -2, 0]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="#1a1f3a" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

export default PrintingComparison;

