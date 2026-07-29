import React, { useContext, useState, useEffect } from 'react';
import './FoodCollection.css';
import { categoryItem } from '../../assets/assests';
import { FoodContext } from '../../context/FoodContext';
import { FaStar, FaPlus, FaCheck, FaSearch } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const FoodCollection = () => {
  const { products, addToCart, currency } = useContext(FoodContext);
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const [addedItems, setAddedItems] = useState({});

  const searchQuery = searchParams.get('search') || '';

  const handleAdd = (id) => {
    addToCart(id);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="food-collection-section" id="food-menu-section">
      <div className="section-header">
        <div className="section-tagline">OUR SPECIAL MENU</div>
        <h2 className="section-title">Explore Delicious Categories</h2>
        <p className="section-subtitle">
          Choose from a wide variety of mouth-watering dishes crafted with love and fresh ingredients.
        </p>
      </div>

      <div className="categories-pills-bar">
        {categoryItem.map((item, index) => (
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item._id} className="food-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.name} className="food-card-img" />
                <div className="rating-badge">
                  <FaStar className="star-icon" />
                  <span>{item.rating || 4.8}</span>
                </div>
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
            <h3>No Dishes Found</h3>
            <p>We couldn't find any dish matching your selection. Try another category or search term.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FoodCollection;