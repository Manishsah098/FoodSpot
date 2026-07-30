import React from "react";
import "./About.css";
import { BiAward, BiShield, BiHeart, BiUserCheck, BiCheckCircle } from "react-icons/bi";

import heroImg from "../../assets/rice2.jpg";

const About = () => {
  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <div className="about-hero-card">
        <div className="about-hero-content">
          <span className="about-badge">Our Story & Craft</span>
          <h1>Serving Delicious Food Made With Passion</h1>
          <p>
            FoodSpot was founded with a single mission: to bring fresh, gourmet culinary experiences directly to your doorstep with uncompromised quality, hygiene, and speed.
          </p>
        </div>
        <div className="about-hero-media">
          <img src={heroImg} alt="Culinary art" />
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="stats-counter-row">
        <div className="stat-card">
          <h2>50,000+</h2>
          <p>Happy Customers</p>
        </div>
        <div className="stat-card">
          <h2>100%</h2>
          <p>Fresh Ingredients</p>
        </div>
        <div className="stat-card">
          <h2>25 Mins</h2>
          <p>Avg Delivery Speed</p>
        </div>
        <div className="stat-card">
          <h2>4.9 / 5</h2>
          <p>Customer Rating</p>
        </div>
      </div>

      {/* Values & Standards */}
      <div className="about-values-section">
        <div className="section-header">
          <h2>Why Thousands Trust FoodSpot</h2>
          <p>We combine master culinary standards with state-of-the-art logistics.</p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <BiShield className="v-icon" />
            <h3>5-Star Kitchen Hygiene</h3>
            <p>Our cloud kitchens follow strict ISO 22000 food safety and sterilization guidelines for every order.</p>
          </div>


          <div className="value-card">
            <BiAward className="v-icon" />
            <h3>Master Executive Chefs</h3>
            <p>Every dish recipe is designed by award-winning chefs with authentic handpicked spices.</p>
          </div>

          <div className="value-card">
            <BiHeart className="v-icon" />
            <h3>Customer First Service</h3>
            <p>Dedicated customer support, real-time live delivery tracking, and hassle-free order resolution.</p>
          </div>

          <div className="value-card">
            <BiUserCheck className="v-icon" />
            <h3>Eco-Friendly Packaging</h3>
            <p>We use 100% biodegradable, spill-proof insulated containers to protect temperature and the planet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
