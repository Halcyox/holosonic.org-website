import React from 'react';
import PropTypes from 'prop-types';
import Citation from '../Citation/Citation';
import Tooltip from '../Tooltip/Tooltip';
import './ResearchCard.css';

/**
 * ResearchCard component for displaying research-backed features
 * 
 * Displays a feature card with title, description, inline citations,
 * and an optional "Learn more" link with tooltip.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {Array<number>} props.citations - Array of citation IDs
 * @param {string} [props.learnMoreUrl] - Optional URL to learn more page
 * @param {string} [props.learnMoreTooltip] - Optional tooltip text for learn more link
 */
function ResearchCard({ title, description, citations = [], learnMoreUrl, learnMoreTooltip }) {
  // Render description with citations at the end (editorial style)
  const renderDescription = () => {
    return (
      <p>
        {description}
        {citations.length > 0 && (
          <>
            {' '}
            {citations.map((citationId, index) => (
              <Citation key={index} id={citationId} />
            ))}
          </>
        )}
      </p>
    );
  };

  // Render learn more link with optional tooltip
  const renderLearnMore = () => {
    if (!learnMoreUrl) return null;

    const link = (
      <a 
        href={learnMoreUrl}
        className="research-link"
      >
        Learn more →
      </a>
    );

    if (learnMoreTooltip) {
      return (
        <Tooltip content={learnMoreTooltip} position="right">
          {link}
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <article className="research-card">
      <h2>{title}</h2>
      {renderDescription()}
      {renderLearnMore()}
    </article>
  );
}

ResearchCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  citations: PropTypes.arrayOf(PropTypes.number),
  learnMoreUrl: PropTypes.string,
  learnMoreTooltip: PropTypes.string,
};

export default ResearchCard;

