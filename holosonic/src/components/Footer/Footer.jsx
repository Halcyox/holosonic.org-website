import React from 'react';
import './Footer.css';

/**
 * Footer component with credits and links
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <p className="footer-copyright">
              © {currentYear} Holosonic. Founded by{' '}
              <a 
                href="https://alifjakir.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                Alif Jakir
              </a>
              {' '}and{' '}
              <a 
                href="https://sylashorowitz.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                Sylas Horowitz
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

