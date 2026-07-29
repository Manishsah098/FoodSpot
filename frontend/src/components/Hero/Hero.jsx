import React from 'react';
import './Hero.css';
import hero_img from '../../assets/pasta3.avif';
import { FaShippingFast, FaStar, FaFire } from 'react-icons/fa';
import { BiSupport, BiTimeFive } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { MdPayment, MdVerified } from 'react-icons/md';

const Hero = () => {
  const scrollToMenu = () => {
    const menuElement = document.getElementById('food-menu-section');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-container">
      <div className="hero-content-wrapper">
        
        <div className="hero-left">
          <div className="trending-badge">
            <FaFire className="fire-icon" />
            <span>#1 Food Delivery Service</span>
          </div>

          <h1 className="hero-title">
            Hungry? We Deliver <span className="highlight-text">Happiness</span> To Your Doorstep.
          </h1>
          
          <p className="hero-subtitle">
            Satisfy your gourmet cravings with freshly prepared meals from top chef kitchens. Lightning-fast delivery guaranteed.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary-hero" onClick={scrollToMenu}>
              Explore Our Menu
            </button>
            <div className="hero-rating-badge">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span className="rating-text">4.9/5 (10k+ Reviews)</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper">
            <div className="hero-circle-bg"></div>
            <img src={hero_img} alt="Delicious Pasta Dish" className="hero-food-img" />
            
            {/* Floating Info Cards */}
            <div className="floating-card top-right-card">
              <span className="floating-emoji">⚡</span>
              <div>
                <p className="floating-title">Super Fast</p>
                <p className="floating-sub">30 Min Delivery</p>
              </div>
            </div>

            <div className="floating-card bottom-left-card">
              <div className="check-badge">
                <MdVerified />
              </div>
              <div>
                <p className="floating-title">100% Fresh</p>
                <p className="floating-sub">Quality Guaranteed</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="hero-features-bar">
        
        <div className="feature-item">
          <div className="feature-icon-wrapper red">
            <FaShippingFast className="feature-icon" />
          </div>
          <div className="feature-text">
            <h3>Free Delivery</h3>
            <p>On orders above ₹300</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-wrapper orange">
            <BiTimeFive className="feature-icon" />
          </div>
          <div className="feature-text">
            <h3>Express Shipping</h3>
            <p>Under 30 mins to doorstep</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-wrapper blue">
            <BiSupport className="feature-icon" />
          </div>
          <div className="feature-text">
            <h3>24/7 Live Support</h3>
            <p>Dedicated customer service</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-wrapper green">
            <MdPayment className="feature-icon" />
          </div>
          <div className="feature-text">
            <h3>Secure Payment</h3>
            <p>UPI, Cards & COD supported</p>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;