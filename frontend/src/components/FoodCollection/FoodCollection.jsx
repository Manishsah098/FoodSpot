import React, { useContext, useState } from 'react';
import './FoodCollection.css';
import { categoryItem } from '../../assets/assests';
import { FoodContext } from '../../context/FoodContext';
import { FaStar, FaPlus, FaCheck, FaSearch, FaArrowRight, FaFire } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';

const FoodCollection = () => {
  const { products, addToCart, currency } = useContext(FoodContext);
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';

  const handleAdd = (id) => {
    addToCart(id);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  // On Home Page: Only display Featured / Top-tier attractive items (approx 8-9 items)
  const homeFeaturedProducts = products
    .filter((product) => {
      // Prioritize products marked featured or top rated
      const isFeaturedOrTop = product.featured || product.rating >= 4.8;
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return isFeaturedOrTop && matchesCategory && matchesSearch;
    })
    .slice(0, 9);

  return (
    <section className="food-collection-section" id="food-menu-section">
      <div className="section-header">
        <div className="section-tagline">
          <FaFire style={{ color: "#ff385c" }} /> POPULAR DISHES SPOTLIGHT
        </div>
        <h2 className="section-title">Trending & Featured Delicacies</h2>
        <p className="section-subtitle">
          Hand-picked chef's specials crafted for an unbeatable gourmet experience. Explore our top favorites below or view our 50+ complete Indian menu.
        </p>
      </div>

      <div className="categories-pills-bar">
        {categoryItem.slice(0, 6).map((item, index) => (
          <button
            key={index}
            onClick={() => setCategory(item.category_title)}
            className={`category-pill ${category === item.category_title ? 'active' : ''}`}
          >
            <span className="pill-icon">{item.icon}</span>
            <span className="pill-title">{item.category_title}</span>
          </button>
        ))}
      </div>

      {searchQuery && (
        <div className="search-status-bar">
          <FaSearch className="search-status-icon" />
          <span>Showing results for: <strong>"{searchQuery}"</strong></span>
        </div>
      )}

      <div className="products-grid">
        {homeFeaturedProducts.length > 0 ? (
          homeFeaturedProducts.map((item) => (
            <div key={item._id} className="food-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.name} className="food-card-img" />
                <div className="rating-badge">
                  <FaStar className="star-icon" />
                  <span>{item.rating || 4.8}</span>
                </div>
                {item.isVeg !== undefined && (
                  <div className={`veg-nonveg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                    <span className="dot" />
                  </div>
                )}
              </div>

              <div className="food-card-content">
                <div className="category-tag">{item.category}</div>
                <h3 className="food-title">{item.name}</h3>
                <p className="food-description">{item.description}</p>
                
                <div className="card-footer">
                  <div className="price-tag">
                    <span className="currency-symbol">{currency}</span>
                    <span className="price-value">{item.price}</span>
                  </div>

                  <button
                    className={`add-cart-btn ${addedItems[item._id] ? 'added' : ''}`}
                    onClick={() => handleAdd(item._id)}
                  >
                    {addedItems[item._id] ? (
                      <>
                        <FaCheck /> Added
                      </>
                    ) : (
                      <>
                        <FaPlus /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products-state">
            <div className="empty-icon">🍲</div>
            <h3>No Featured Dishes Found</h3>
            <p>We couldn't find any dish matching your selection. View our full 50+ item menu catalog!</p>
          </div>
        )}
      </div>

      {/* CTA Button to Full Menu Page */}
      <div className="home-menu-cta-box">
        <div className="cta-content">
          <h3>Want to explore more delicious Indian options?</h3>
          <p>Over 50+ authentic Biryanis, Thalis, Kebabs, Dosa, Street Snacks & Desserts await you.</p>
        </div>
        <button className="view-full-menu-btn" onClick={() => navigate('/menu')}>
          Explore Full 50+ Menu <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default FoodCollection;