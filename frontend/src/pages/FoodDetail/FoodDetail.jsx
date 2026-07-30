import React, { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./FoodDetail.css";
import { FoodContext } from "../../context/FoodContext";
import { BiStar, BiTimeFive, BiAlarm, BiPlus, BiMinus, BiArrowBack, BiShoppingBag, BiCheck } from "react-icons/bi";

import { toast } from "react-toastify";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, currency } = useContext(FoodContext);

  const product = products.find((p) => p._id === id);

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);

  if (!product) {
    return (
      <div className="food-not-found-container">
        <h2>Dish Not Found</h2>
        <p>The requested food item does not exist or has been removed.</p>
        <button className="back-btn" onClick={() => navigate("/menu")}>
          Back to Menu
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id);
    }
  };

  return (
    <div className="food-detail-container">
      {/* Back Navigation */}
      <Link to="/menu" className="back-nav-link">
        <BiArrowBack /> Back to Menu
      </Link>

      <div className="food-detail-grid">
        {/* Left Column: Food Image & Highlights */}
        <div className="food-media-col">
          <div className="food-main-img-card">
            <img src={product.image} alt={product.name} className="detail-hero-img" />
            <span className="detail-category-badge">{product.category}</span>
          </div>

          <div className="dish-highlights-grid">
            <div className="highlight-box">
              <BiTimeFive className="hl-icon" />
              <div>
                <span>Prep Time</span>
                <strong>20-25 mins</strong>
              </div>
            </div>
            <div className="highlight-box">
              <BiAlarm className="hl-icon flame" />
              <div>
                <span>Calories</span>
                <strong>450 kcal</strong>
              </div>
            </div>

            <div className="highlight-box">
              <BiStar className="hl-icon star" />
              <div>
                <span>Rating</span>
                <strong>{product.rating || 4.8} / 5.0</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dish Info & Customization */}
        <div className="food-info-col">
          <h1 className="dish-title">{product.name}</h1>

          <div className="dish-price-row">
            <h2 className="dish-price">{currency}{product.price}</h2>
            <span className="tax-inclusive-tag">Inclusive of all taxes</span>
          </div>

          <p className="dish-description">{product.description}</p>

          <hr className="detail-divider" />

          {/* Customization: Spice Level */}
          <div className="custom-section">
            <h3>Choose Spice Level</h3>
            <div className="spice-pills">
              {["Mild", "Medium", "Spicy"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  className={`spice-btn ${spiceLevel === level ? "active" : ""}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Customization: Add-ons */}
          <div className="custom-section">
            <h3>Add-on Extra Toppings</h3>
            <div className="addon-options">
              <label className={`addon-chip ${extraCheese ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={extraCheese}
                  onChange={(e) => setExtraCheese(e.target.checked)}
                />
                <span>Extra Mozzarella Cheese (+{currency}40)</span>
              </label>
              <label className={`addon-chip ${extraSauce ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={extraSauce}
                  onChange={(e) => setExtraSauce(e.target.checked)}
                />
                <span>Chef Special Dip Sauce (+{currency}25)</span>
              </label>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="purchase-action-card">
            <div className="quantity-counter">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >
                <BiMinus />
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
              >
                <BiPlus />
              </button>
            </div>

            <button type="button" onClick={handleAddToCart} className="add-cart-action-btn">
              <BiShoppingBag className="btn-icon" />
              <span>Add {quantity} to Cart • {currency}{product.price * quantity + (extraCheese ? 40 : 0) + (extraSauce ? 25 : 0)}</span>
            </button>
          </div>

          {/* Safety & Guarantee Badges */}
          <div className="guarantee-badges">
            <div className="g-badge"><BiCheck /> 100% Hygienically Cooked</div>
            <div className="g-badge"><BiCheck /> Hot & Fresh Delivery Guarantee</div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="reviews-section-card">
        <h2>Customer Reviews & Feedback</h2>
        <div className="reviews-list">
          <div className="review-item">
            <div className="reviewer-info">
              <strong>Ankit Verma</strong>
              <div className="review-stars">★★★★★</div>
            </div>
            <p>"Absolutely delicious! Arrived piping hot within 25 minutes. Will definitely order again."</p>
          </div>
          <div className="review-item">
            <div className="reviewer-info">
              <strong>Sneha Patel</strong>
              <div className="review-stars">★★★★☆</div>
            </div>
            <p>"Rich flavors and great portion size. Perfect comfort food!"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
