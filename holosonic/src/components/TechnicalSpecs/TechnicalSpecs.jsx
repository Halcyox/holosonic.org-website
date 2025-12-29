import React from 'react';
import PropTypes from 'prop-types';
import './TechnicalSpecs.css';

/**
 * TechnicalSpecs component for displaying technical specifications
 * 
 * Displays a grid of technical specifications with labels and values.
 * Only shows specifications that have values.
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.specs={}] - Object containing technical specifications
 */
function TechnicalSpecs({ specs = {} }) {
  const specItems = [
    { label: 'Frequency Range', value: specs.frequencyRange },
    { label: 'Particle Size Range', value: specs.particleSizeRange },
    { label: 'Positioning Precision', value: specs.positioningPrecision },
    { label: 'Penetration Depth', value: specs.penetrationDepth },
    { label: 'Printing Speed', value: specs.printingSpeed },
    { label: 'Cell Viability', value: specs.cellViability },
  ].filter(item => item.value); // Only show items with values

  if (!specItems.length) return null;

  return (
    <section className="technical-specs">
      <div className="container">
        <h2>Technical Specifications</h2>
        <div className="specs-grid">
          {specItems.map((item, index) => (
            <div key={index} className="spec-item">
              <dt className="spec-label">{item.label}</dt>
              <dd className="spec-value">{item.value}</dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

TechnicalSpecs.propTypes = {
  specs: PropTypes.shape({
    frequencyRange: PropTypes.string,
    particleSizeRange: PropTypes.string,
    positioningPrecision: PropTypes.string,
    penetrationDepth: PropTypes.string,
    printingSpeed: PropTypes.string,
    cellViability: PropTypes.string,
  }),
};

export default TechnicalSpecs;

