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

            {/* Rotating and Pulsating Particle Swarm */}
            <RotatingPulsatingParticleSwarm />
          </Canvas>
          <h1>Holosonic: Shaping Matter with Sound</h1>
          <p>Revolutionizing manipulation of particles through advanced acoustic levitation.</p>
          {/* <a href="#products" className="cta-button">
            Discover Our Technology
          </a> */}
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="features">
        <div className="feature">
          {/* Image or 3D model representing acoustic levitation */}
          {/* <img src="images/acoustic-levitation.png" alt="3D Acoustic Levitation" /> */}
          <h2>3D Acoustic Levitation</h2>
          <p>
            Experience the breakthrough in manipulating particles in mid-air with arbitrary configurations.
          </p>
        </div>
        <div className="feature">
          {/* Image or 3D model representing precision manufacturing */}
          {/* <img src="images/precision-manufacturing.png" alt="Precision Manufacturing" /> */}
          <h2>Precision Manufacturing</h2>
          <p>
            Overcoming traditional manufacturing limits by crafting complex structures without physical contact.
          </p>
        </div>
        <div className="feature">
          {/* Image or 3D model representing synthetic biology */}
          {/* <img src="images/synthetic-biology.png" alt="Synthetic Biology Applications" /> */}
          <h2>Synthetic Biology Applications</h2>
          <p>
            Enabling advanced cell patterning and tissue engineering through gentle, precise manipulation.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Explore the Possibilities?</h2>
        {/* <a href="#contact" className="cta-button">
          Get in Touch
        </a> */}
      </section>
    </div>
  );
}

export default App;
