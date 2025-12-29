import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MultiParticleDemo - Shows multiple particles being manipulated independently
 * Demonstrates simultaneous control of multiple objects in 3D space
 */
function MultiParticleDemo() {
  const particleRefs = useRef([]);
  
  const particleConfigs = useMemo(() => [
    { color: '#40e0d0', path: 'circle' },
    { color: '#60c0ff', path: 'figure8' },
    { color: '#ff6b9d', path: 'helix' },
    { color: '#c084fc', path: 'square' },
  ], []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    particleRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const config = particleConfigs[index];
      const t = time * 0.5 + index * 0.5; // Offset each particle
      let x, y, z;
      
      switch (config.path) {
        case 'circle':
          x = Math.cos(t) * 1.5;
          y = Math.sin(t) * 1.5;
          z = Math.sin(t * 0.5) * 0.5;
          break;
        case 'figure8':
          x = Math.sin(t) * 1.2;
          y = Math.sin(t * 2) * 0.8;
          z = Math.cos(t) * 1.2;
          break;
        case 'helix':
          x = Math.cos(t) * 1.0;
          y = (t * 0.3) % 3 - 1.5;
          z = Math.sin(t) * 1.0;
          break;
        case 'square':
          const period = t % (Math.PI * 2);
          if (period < Math.PI / 2) {
            x = period * 1.2;
            y = 0;
            z = 0;
          } else if (period < Math.PI) {
            x = (Math.PI / 2) * 1.2;
            y = (period - Math.PI / 2) * 1.2;
            z = 0;
          } else if (period < Math.PI * 1.5) {
            x = (Math.PI / 2) * 1.2 - (period - Math.PI) * 1.2;
            y = (Math.PI / 2) * 1.2;
            z = 0;
          } else {
            x = 0;
            y = (Math.PI / 2) * 1.2 - (period - Math.PI * 1.5) * 1.2;
            z = 0;
          }
          break;
        default:
          x = y = z = 0;
      }
      
      ref.position.set(x, y, z);
    });
  });

  // Generate trail paths
  const trailGeometries = useMemo(() => {
    return particleConfigs.map((config) => {
      const points = [];
      const numPoints = 100;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        let x, y, z;
        
        switch (config.path) {
          case 'circle':
            x = Math.cos(t) * 1.5;
            y = Math.sin(t) * 1.5;
            z = Math.sin(t * 0.5) * 0.5;
            break;
          case 'figure8':
            x = Math.sin(t) * 1.2;
            y = Math.sin(t * 2) * 0.8;
            z = Math.cos(t) * 1.2;
            break;
          case 'helix':
            x = Math.cos(t) * 1.0;
            y = (t * 0.3) % 3 - 1.5;
            z = Math.sin(t) * 1.0;
            break;
          case 'square':
            const period = t % (Math.PI * 2);
            if (period < Math.PI / 2) {
              x = period * 1.2;
              y = 0;
              z = 0;
            } else if (period < Math.PI) {
              x = (Math.PI / 2) * 1.2;
              y = (period - Math.PI / 2) * 1.2;
              z = 0;
            } else if (period < Math.PI * 1.5) {
              x = (Math.PI / 2) * 1.2 - (period - Math.PI) * 1.2;
              y = (Math.PI / 2) * 1.2;
              z = 0;
            } else {
              x = 0;
              y = (Math.PI / 2) * 1.2 - (period - Math.PI * 1.5) * 1.2;
              z = 0;
            }
            break;
          default:
            x = y = z = 0;
        }
        points.push(new THREE.Vector3(x, y, z));
      }
      
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [particleConfigs]);

  return (
    <group>
      {/* Trail paths */}
      {trailGeometries.map((geometry, index) => (
        <line key={`trail-${index}`} geometry={geometry}>
          <lineBasicMaterial 
            color={particleConfigs[index].color} 
            opacity={0.2} 
            transparent 
            linewidth={2}
          />
        </line>
      ))}
      
      {/* Particles */}
      {particleConfigs.map((config, index) => (
        <mesh 
          key={`particle-${index}`}
          ref={(el) => (particleRefs.current[index] = el)}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color={config.color} 
            emissive={config.color}
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default MultiParticleDemo;

