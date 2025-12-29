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
            <p className="footer-contact">
              Contact us if you're interested in investing or wanting to build with us! {' '}<br/>
              <a 
                href="mailto:alif@superintelligent.group"
                className="footer-link"
              >
                alif@superintelligent.group
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

