import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AcousticFieldVisualization from '../AcousticFieldVisualization/AcousticFieldVisualization';
import Citation from '../Citation/Citation';
import './Hero.css';

/**
 * Hero component with research-oriented copy and citations
 * 
 * Main hero section featuring title, subtitle, description with citations,
 * and an interactive 3D visualization of the acoustic field.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Main title
 * @param {string} [props.subtitle] - Subtitle below title
 * @param {string} [props.subsubtitle] - Subsubtitle below subtitle
 * @param {string} props.description - Description paragraph
 * @param {Array<number>} [props.citations=[]] - Array of citation IDs
 */
function Hero({ title, subtitle, subsubtitle, description, citations = [] }) {
  return (
    <header className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{title}</h1>
          {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
          {subsubtitle && <h3 className="hero-subsubtitle">{subsubtitle}</h3>}
          <p>
            {description}
            {citations.map((citationId, index) => (
              <Citation key={index} id={citationId} />
            ))}
          </p>
        </div>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 2]} intensity={1.2} color="#40e0d0" />
          <pointLight position={[-2, -2, -1]} intensity={0.4} color="#60c0ff" />
          <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={4}
            maxDistance={10}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
          <AcousticFieldVisualization />
        </Canvas>
      </div>
    </header>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  subsubtitle: PropTypes.string,
  description: PropTypes.string.isRequired,
  citations: PropTypes.arrayOf(PropTypes.number),
};

export default Hero;

