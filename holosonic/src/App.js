import React, { useRef, useState } from 'react';
import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Plane } from '@react-three/drei';

function RotatingPulsatingParticleSwarm() {
  const swarmRef = useRef();
  const particles = useRef([]);

  // Create an array of initial particle objects with initial state
  const numParticles = 50;
  const separationDistance = 0.01; // Adjust this to control separation behavior
  const alignmentFactor = 2.02; // Adjust this to control alignment behavior
  const cohesionFactor = 0.25; // Adjust this to control cohesion behavior

  if (!particles.current.length) {
    particles.current = Array(numParticles).fill().map(() => ({
      position: [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2],
      velocity: [Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005],
    }));
  }

  useFrame((state) => {
    const positions = particles.current.map((particle, index) => {
      // Apply simple chaotic motion
      particle.velocity[0] += (Math.random() - 0.5) * 0.005;
      particle.velocity[1] += (Math.random() - 0.5) * 0.005;
      particle.velocity[2] += (Math.random() - 0.5) * 0.005;

      // Update position based on velocity
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];

      // Apply boundaries to keep particles within a defined space
      if (particle.position[0] > 2) particle.position[0] = -2;
      if (particle.position[0] < -2) particle.position[0] = 2;
      if (particle.position[1] > 2) particle.position[1] = -2;
      if (particle.position[1] < -2) particle.position[1] = 2;
      if (particle.position[2] > 2) particle.position[2] = -2;
      if (particle.position[2] < -2) particle.position[2] = 2;

      // Return the updated position
      return particle.position;
    });

    // Update the positions and scale (pulsation) of the Sphere components
    swarmRef.current.children.forEach((child, index) => {
      const newPosition = positions[index];
      child.position.set(newPosition[0], newPosition[1], newPosition[2]);

      // Apply pulsation effect
      const scaleChange = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
      child.scale.set(scaleChange, scaleChange, scaleChange);
    });

    // Apply boid-like behavior
    particles.current.forEach((particle, index) => {
      // Initialize vectors for alignment and cohesion
      let alignment = [0, 0, 0];
      let cohesion = [0, 0, 0];

      // Iterate over other particles
      particles.current.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            (particle.position[0] - otherParticle.position[0]) ** 2 +
            (particle.position[1] - otherParticle.position[1]) ** 2 +
            (particle.position[2] - otherParticle.position[2]) ** 2
          );

          // Separation: Move away from nearby particles
          if (distance < separationDistance) {
            const separationForce = [
              particle.position[0] - otherParticle.position[0],
              particle.position[1] - otherParticle.position[1],
              particle.position[2] - otherParticle.position[2],
            ];
            alignment[0] -= separationForce[0];
            alignment[1] -= separationForce[1];
            alignment[2] -= separationForce[2];
          }

          // Alignment: Align with nearby particles
          if (distance < separationDistance) {
            alignment[0] += otherParticle.velocity[0];
            alignment[1] += otherParticle.velocity[1];
            alignment[2] += otherParticle.velocity[2];
          }

          // Cohesion: Move toward the center of nearby particles
          if (distance < separationDistance) {
            cohesion[0] += otherParticle.position[0];
            cohesion[1] += otherParticle.position[1];
            cohesion[2] += otherParticle.position[2];
          }
        }
      });

      // Apply the alignment, cohesion, and separation factors
      particle.velocity[0] += alignment[0] * alignmentFactor + cohesion[0] * cohesionFactor;
      particle.velocity[1] += alignment[1] * alignmentFactor + cohesion[1] * cohesionFactor;
      particle.velocity[2] += alignment[2] * alignmentFactor + cohesion[2] * cohesionFactor;
    });

    // Rotate the entire group
    if (swarmRef.current) {
      swarmRef.current.rotation.x += 0.005;
      swarmRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={swarmRef}>
      {particles.current.map((particle, index) => (
        <Sphere
          key={index}
          args={[0.15, 16, 16]}
          position={particle.position}
        >
          <meshStandardMaterial attach="material" color="cyan" />
        </Sphere>
      ))}
    </group>
  );
}


function App() {
  return (
    <div className="App">
      <header className="hero">
        <div className="hero-content">
          <Canvas>
            {/* Camera and Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {/* Rotating and Pulsating Cube */}
            <RotatingPulsatingParticleSwarm />
          </Canvas>
          <h1>Welcome to Holosonic</h1>
          <p>Pioneering holographic sound fields to animate particles in midair.</p>
          <a href="#products" className="cta-button">Explore our Products</a>
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="features">
        <div className="feature">
          <Sphere args={[0.5, 32, 32]} position={[1, 0, 0]} castShadow>
            <meshStandardMaterial attach="material" color="orange" />
          </Sphere>
          <h2>Immersive Sound</h2>
          <p>Experience sound like never before with our holographic technology.</p>
        </div>
        <div className="feature">
          <Plane args={[1, 1, 10, 10]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <meshStandardMaterial attach="material" color="green" />
          </Plane>
          <h2>Particle Animation</h2>
          <p>Watch particles come to life in midair with our cutting-edge systems.</p>
        </div>
        <div className="feature">
          <Sphere args={[0.5, 32, 32]} position={[-1, 0, 0]} castShadow>
            <meshStandardMaterial attach="material" color="purple" />
          </Sphere>
          <h2>Global Streaming</h2>
          <p>Stream our holographic sound fields from anywhere in the world.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to experience the future of sound?</h2>
        <a href="#contact" className="cta-button">Contact Us</a>
      </section>
    </div>
  );
}

export default App;
