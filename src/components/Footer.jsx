import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>We are dedicated to providing the best shopping experience.</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: <a href="mailto:info@ecommerce.com">info@ecommerce.com</a></p>
            <p>Phone: <a href="tel:+11234567890">(123) 456-7890</a></p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
