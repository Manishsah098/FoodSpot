import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { BiUser, BiCart, BiSearch, BiFoodMenu, BiShoppingBag, BiLogOut } from "react-icons/bi";
import { FoodContext } from "../../context/FoodContext";
import { FaUtensils } from "react-icons/fa";

export const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 400);
  };

  const { getCartCount } = useContext(FoodContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navbar-wrapper">
      {loading && (
        <div className="loader-container">
          <div className="loader">
            <FaUtensils className="loader-icon" />
          </div>
        </div>
      )}
      <nav className="navbar">
        <Link to="/" className="logo-container">
          <div className="logo-badge">
            <FaUtensils className="logo-icon" />
          </div>
          <div className="logo-text">
            <h2>Food<span>Spot</span></h2>
          </div>
        </Link>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <BiSearch className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Search pizza, pasta, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <div className="nav-actions">
          <div className="profile-group">
            <button className="icon-btn profile-btn" aria-label="Account">
              <BiUser className="action-icon" />
              <span className="btn-label">Account</span>
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <p className="user-greeting">Welcome Guest</p>
                <span className="user-sub">FoodSpot Customer</span>
              </div>
              <hr className="dropdown-divider" />
              <Link to="/login" className="dropdown-item">
                <BiUser className="menu-icon" />
                <span>Login / Sign Up</span>
              </Link>
              <Link to="/orders" className="dropdown-item">
                <BiShoppingBag className="menu-icon" />
                <span>My Orders</span>
              </Link>
              <div className="dropdown-item logout" onClick={() => navigate("/login")}>
                <BiLogOut className="menu-icon" />
                <span>Logout</span>
              </div>
            </div>
          </div>

          <button
            className="icon-btn cart-btn"
            onClick={() => handleNavigation("/cart")}
            aria-label="Shopping Cart"
          >
            <div className="cart-icon-wrapper">
              <BiCart className="action-icon" />
              {getCartCount() > 0 && (
                <span className="cart-qty-badge">{getCartCount()}</span>
              )}
            </div>
            <span className="btn-label">Cart</span>
          </button>
        </div>
      </nav>
    </header>
  );
};