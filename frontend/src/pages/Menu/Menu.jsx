import React, { useContext, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Menu.css";
import { FoodContext } from "../../context/FoodContext";
import { categoryItem } from "../../assets/assests";
import { BiSearch, BiStar, BiPlus, BiFilterAlt, BiInfoCircle } from "react-icons/bi";

const Menu = () => {
  const { products, addToCart, currency } = useContext(FoodContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Spaghetti" && item.category.toLowerCase() === "spaghetti");
      
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.rating - a.rating; // default recommended
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="menu-page-container">
      {/* Header Banner */}
      <div className="menu-header">
        <h1 className="page-title">Explore Our Full Menu</h1>
        <p className="page-subtitle">Discover handcrafted gourmet dishes prepared with fresh premium ingredients.</p>
      </div>

      {/* Controls Bar: Search & Sorting */}
      <div className="menu-controls-card">
        <div className="menu-search-wrapper">
          <BiSearch className="menu-search-icon" />
          <input
            type="text"
            placeholder="Search by dish name, ingredient, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-search-input"
          />
        </div>

        <div className="menu-sort-wrapper">
          <BiFilterAlt className="sort-icon" />
          <span>Sort By:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="recommended">Top Rated (Recommended)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-container">
        {categoryItem.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat.category_title)}
            className={`category-tab-btn ${selectedCategory === cat.category_title ? "active" : ""}`}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-title">{cat.category_title}</span>
          </button>
        ))}
      </div>

      {/* Results Count Banner */}
      <div className="results-info-bar">
        <p>Showing <strong>{filteredProducts.length}</strong> delicious item{filteredProducts.length !== 1 ? 's' : ''} in <strong>{selectedCategory}</strong></p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="menu-products-grid">
          {filteredProducts.map((item) => (
            <div key={item._id} className="menu-food-card">
              
              <div className="food-img-wrapper">
                <img src={item.image} alt={item.name} className="food-card-img" />
                <div className="food-badge">{item.category}</div>
                <div className="food-rating">
                  <BiStar className="star-icon" />
                  <span>{item.rating || 4.8}</span>
                </div>
              </div>

              <div className="food-card-content">
                <h3 className="food-card-title">{item.name}</h3>
                <p className="food-card-desc">{item.description}</p>

                <div className="food-card-footer">
                  <div className="food-price-tag">
                    <span className="price-label">Price</span>
                    <h4 className="price-amount">{currency}{item.price}</h4>
                  </div>

                  <div className="card-actions-group">
                    <Link to={`/food/${item._id}`} className="detail-view-btn" title="View Full Details">
                      <BiInfoCircle /> Details
                    </Link>
                    
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item._id)}
                      title="Add to Cart"
                    >
                      <BiPlus className="btn-icon" /> Add
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="no-products-view">
          <BiSearch className="empty-search-icon" />
          <h3>No Dishes Found</h3>
          <p>We couldn't find any dishes matching "{searchQuery}". Try searching for another dish or category.</p>
          <button className="reset-filter-btn" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
            View All Dishes
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
