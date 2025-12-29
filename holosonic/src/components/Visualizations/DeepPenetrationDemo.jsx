import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DeepPenetrationDemo - Shows how sound waves penetrate tissue while light is blocked/scattered
 */
function DeepPenetrationDemo() {
  const lightRayRef = useRef();
  const soundWaveRef = useRef();
  const progress = useRef(0);
  const animationSpeed = 0.4;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    progress.current = (time * animationSpeed) % 2;
    
    // Animate light ray (gets blocked/scattered)
    if (lightRayRef.current) {
      const lightProgress = Math.min(progress.current, 0.3); // Stops early
      lightRayRef.current.position.y = -2 + lightProgress * 2;
      lightRayRef.current.material.opacity = 1 - lightProgress * 2;
    }
    
    // Animate sound wave (penetrates through)
    if (soundWaveRef.current) {
      const soundProgress = Math.min(progress.current, 1);
      soundWaveRef.current.position.y = -2 + soundProgress * 4;
      soundWaveRef.current.material.opacity = 0.6;
    }
  });

  return (
    <group>
      {/* Tissue representation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2, 0.5]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          opacity={0.3} 
          transparent
          roughness={0.8}
        />
      </mesh>
      
      {/* Tissue label */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[2, 0.3]} />
        <meshBasicMaterial color="#1a1f3a" opacity={0.8} transparent />
      </mesh>

      {/* Light ray (left side) - gets blocked */}
      <group position={[-1.5, -2, 0]}>
        <mesh ref={lightRayRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffd700"
            emissiveIntensity={0.8}
            opacity={1}
            transparent
          />
        </mesh>
        {/* Scattered light particles */}
        {progress.current < 0.3 && (
          <>
            {[...Array(5)].map((_, i) => (
              <mesh 
                key={i}
                position={[
                  (Math.random() - 0.5) * 0.5,
                  progress.current * 2 - 1.5 + Math.random() * 0.3,
                  (Math.random() - 0.5) * 0.3
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial 
                  color="#ffd700" 
                  emissive="#ffd700"
                  emissiveIntensity={0.5}
                  opacity={0.6}
                  transparent
                />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* Sound wave (right side) - penetrates through */}
      <group position={[1.5, -2, 0]}>
        <mesh ref={soundWaveRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial 
            color="#40e0d0" 
            emissive="#40e0d0"
            emissiveIntensity={0.6}
            opacity={0.6}
            transparent
          />
        </mesh>
        {/* Sound wave rings */}
        {progress.current < 1 && (
          <>
            {[...Array(3)].map((_, i) => {
              const ringProgress = progress.current - i * 0.1;
              if (ringProgress < 0) return null;
              return (
                <mesh 
                  key={i}
                  position={[0, ringProgress * 4 - 2, 0]}
                >
                  <torusGeometry args={[0.15 + i * 0.05, 0.02, 8, 16]} />
                  <meshStandardMaterial 
                    color="#40e0d0" 
                    emissive="#40e0d0"
                    emissiveIntensity={0.4}
                    opacity={0.4 - i * 0.1}
                    transparent
                  />
                </mesh>
              );
            })}
          </>
        )}
      </group>

      {/* Labels */}
      <mesh position={[-1.5, -2.5, 0]}>
        <planeGeometry args={[1, 0.25]} />
        <meshBasicMaterial color="#1a1f3a" opacity={0.8} transparent />
      </mesh>
      <mesh position={[1.5, -2.5, 0]}>
        <planeGeometry args={[1, 0.25]} />
        <meshBasicMaterial color="#1a1f3a" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

export default DeepPenetrationDemo;

