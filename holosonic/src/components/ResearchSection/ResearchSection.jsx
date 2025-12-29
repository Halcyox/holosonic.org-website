import React from 'react';
import PropTypes from 'prop-types';
import './ResearchSection.css';

/**
 * ResearchSection component for displaying related research
 * 
 * Displays a list of research publications with citations,
 * authors, journals, and links to full publications.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.publications=[]] - Array of publication objects
 */
function ResearchSection({ publications = [] }) {
  if (!publications.length) return null;

  return (
    <section className="research-section" id="references">
      <div className="container">
        <h2>Related Research</h2>
        <div className="publications-list">
          {publications.map((pub, index) => (
            <article key={index} className="publication">
              <div className="publication-header">
                <span className="citation-number">[{pub.id}]</span>
                <h3 className="publication-title">{pub.title}</h3>
              </div>
              <div className="publication-meta">
                <p className="publication-authors">{pub.authors}</p>
                {pub.journal && (
                  <p className="publication-journal">
                    <em>{pub.journal}</em>
                    {pub.year && ` (${pub.year})`}
                  </p>
                )}
                {pub.institution && (
                  <p className="publication-institution">{pub.institution}</p>
                )}
              </div>
              {pub.url && (
                <a 
                  href={pub.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="publication-link"
                >
                  View publication →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

ResearchSection.propTypes = {
  publications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      authors: PropTypes.string,
      journal: PropTypes.string,
      year: PropTypes.number,
      institution: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default ResearchSection;

