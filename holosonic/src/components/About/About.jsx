import React from 'react';
import './About.css';

/**
 * About component for startup information
 */
function About() {
  return (
    <section className="about">
      <div className="container">
        <h2>About Holosonic</h2>
        <div className="about-content">
          <p className="about-description">
            Holosonic is a startup commercializing breakthrough acoustic levitation technology. Founded by researchers Alif Jakir and Sylas Horowitz, we're translating peer-reviewed research into programmable matter systems for manufacturing and synthetic biology. 
            (Yes, we're actually using sound to move things around. It's as cool as it sounds.)
          </p>
          <div className="about-founders">
            <p className="founders-label">Built by</p>
            <div className="founders-links">
              <a 
                href="https://alifjakir.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="founder-link"
              >
                Alif Jakir
              </a>
              <span className="founders-separator">and</span>
              <a 
                href="https://sylashorowitz.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="founder-link"
              >
                Sylas Horowitz
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

