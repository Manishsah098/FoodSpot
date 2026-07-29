import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { FaUtensils } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get instant updates on exclusive promos, chef discounts, and new menu additions.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="subscribe-btn">Join Now</button>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Main Footer Links */}
        <div className="footer-main-grid">
          
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-logo-badge">
                <FaUtensils />
              </div>
              <h2>Food<span>Spot</span></h2>
            </div>
            <p className="footer-desc">
              Your favorite meals delivered fast, hot, and fresh right to your doorstep. Satisfy every craving with quality dining experiences.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-icon" aria-label="Youtube"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#food-menu-section">Our Menu</a></li>
              <li><a href="/orders">Track Orders</a></li>
              <li><a href="/cart">Shopping Cart</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Cuisines</h4>
            <ul>
              <li><a href="/?search=Pizza">Italian Pizza</a></li>
              <li><a href="/?search=Pasta">Gourmet Pasta</a></li>
              <li><a href="/?search=Rice">Fried Rice Dishes</a></li>
              <li><a href="/?search=Noodles">Wok Noodles</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul>
              <li>📍 123 Gourmet Street, Foodville</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ support@foodspot.com</li>
              <li>⏰ 24/7 Delivery Available</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 FoodSpot. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;