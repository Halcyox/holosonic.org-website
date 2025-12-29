import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PropTypes from 'prop-types';
import './VisualizationContainer.css';

/**
 * VisualizationContainer - Reusable wrapper for 3D visualizations
 * Provides consistent Canvas setup with lighting and controls
 */
function VisualizationContainer({ children, height = '400px', caption }) {
  return (
    <div className="visualization-container">
      <div className="visualization-canvas" style={{ height }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#40e0d0" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#60c0ff" />
          <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            autoRotate={false}
          />
          {children}
        </Canvas>
      </div>
      {caption && (
        <p className="visualization-caption">{caption}</p>
      )}
    </div>
  );
}

VisualizationContainer.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  caption: PropTypes.string,
};

export default VisualizationContainer;

