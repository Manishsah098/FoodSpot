import React from 'react'
import './Hero.css'
import hero_img from '../../assets/pasta3.avif'
import { FaShippingFast } from 'react-icons/fa'
import { BiSupport } from 'react-icons/bi'
import { FiSend } from 'react-icons/fi'
import { MdPayment } from 'react-icons/md'

const Hero = () => {
  return (
    <div className="hero">

      <div className="hero_top">

        <div className="hero_left">
          <h2>Enjoy Your Delicious Meal</h2>
          <h2>Discover Delicious Healthy Meal That Nourishes You.</h2>
          <p>
            Taste happiness in every bite. Order delicious meals quickly and
            satisfy your cravings today.
          </p>
          <button>Explore Our Menu</button>
        </div>

        <div className="hero_right">
          <img src={hero_img} alt="food" className="hero_right-img" />
        </div>

      </div>

      <div className="hero_bottom">

        <div className="hero_content">
          <div className="info_icon">
            <FaShippingFast className="hero_icon" />
          </div>
          <div className="detail">
            <h3>Free Shipping</h3>
            <p>Free shipping on orders.</p>
          </div>
        </div>

        <div className="hero_content">
          <div className="info_icon">
            <FiSend className="hero_icon" />
          </div>
          <div className="detail">
            <h3>Worldwide Delivery</h3>
            <p>We deliver to all locations.</p>
          </div>
        </div>

        <div className="hero_content">
          <div className="info_icon">
            <BiSupport className="hero_icon" />
          </div>
          <div className="detail">
            <h3>24/7 Support</h3>
            <p>Full support on process</p>
          </div>
        </div>

        <div className="hero_content">
          <div className="info_icon">
            <MdPayment className="hero_icon" />
          </div>
          <div className="detail">
            <h3>Secure Payment</h3>
            <p>Your payment is secure</p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Hero