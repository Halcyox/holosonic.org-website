import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Tooltip.css';

/**
 * Simple tooltip component - pure CSS positioning
 * 
 * Displays a tooltip on hover using standard CSS positioning.
 * No z-index hacks or complex positioning logic.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Element that triggers the tooltip
 * @param {string|React.ReactNode} props.content - Tooltip content
 * @param {string} [props.position='right'] - Tooltip position: 'top', 'bottom', 'left', 'right'
 */
function Tooltip({ children, content, position = 'right' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className={`tooltip-wrapper tooltip-wrapper-${position}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`} role="tooltip">
          <div className="tooltip-content">
            {content}
          </div>
        </div>
      )}
    </span>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default Tooltip;
