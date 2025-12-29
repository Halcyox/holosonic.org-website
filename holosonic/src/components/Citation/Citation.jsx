import React from 'react';
import PropTypes from 'prop-types';
import { researchCitations } from '../../data/research';
import Tooltip from '../Tooltip/Tooltip';
import './Citation.css';

/**
 * Citation component for editorial-style inline citations with rich tooltip
 * 
 * Displays an inline citation with a superscript number that shows
 * detailed citation information in a tooltip on hover.
 * 
 * @param {Object} props - Component props
 * @param {number} props.id - Citation ID (1, 2, or 3)
 * @param {string} [props.url] - Optional URL override
 * @param {string} [props.text] - Optional custom citation text
 */
function Citation({ id, url, text }) {
  // Find citation data by ID
  const citationData = Object.values(researchCitations).find(cite => cite.id === id);
  const citationUrl = url || citationData?.url;
  const citationText = text || citationData?.title || `Citation ${id}`;
  
  // Build tooltip content
  const tooltipContent = (
    <div className="citation-tooltip">
      <div className="citation-tooltip-title">{citationText}</div>
      {citationData?.authors && (
        <div className="citation-tooltip-authors">{citationData.authors}</div>
      )}
      {citationData?.journal && (
        <div className="citation-tooltip-journal">
          <em>{citationData.journal}</em>
          {citationData.year && ` (${citationData.year})`}
        </div>
      )}
      {citationUrl && (
        <div className="citation-tooltip-link">Click to view source</div>
      )}
    </div>
  );

  const handleClick = (e) => {
    if (!citationUrl) {
      e.preventDefault();
      const referencesSection = document.getElementById('references');
      if (referencesSection) {
        referencesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const citationElement = (
    <Tooltip content={tooltipContent} position="right">
      <sup 
        className="citation" 
        onClick={!citationUrl ? handleClick : undefined}
      >
        [{id}]
      </sup>
    </Tooltip>
  );

  if (citationUrl) {
    return (
      <a 
        href={citationUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="citation-link"
        aria-label={`Citation ${id}: ${citationText}`}
      >
        {citationElement}
      </a>
    );
  }

  return citationElement;
}

Citation.propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string,
  text: PropTypes.string,
};

export default Citation;

