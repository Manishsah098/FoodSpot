import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BiUser, BiCart, BiSearch, BiShoppingBag, BiLogOut,
  BiShield, BiCycling, BiX, BiMenu
} from "react-icons/bi";
import { FaUtensils } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { FoodContext } from "../../context/FoodContext";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { getCartCount, user, logoutUser, orders } = useContext(FoodContext);

  const pendingOrdersCount = orders ? orders.filter(o => o.status === "Pending Verification").length : 0;
  const activeDeliveryCount = orders ? orders.filter(o => o.status === "Verified by Admin" || o.status === "Out for Delivery").length : 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="navbar-wrapper">
      {/* Top Bar: Logo + Search + Actions */}
      <div className="navbar-top">
        <div className="navbar-top-inner">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <div className="logo-badge">
              <FaUtensils className="logo-icon" />
            </div>
            <div className="logo-text">
              <h2>Food<span>Spot</span></h2>
              <p>Gourmet Delivery</p>
            </div>
          </Link>

          {/* Search */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <BiSearch className="search-icon-left" />
            <input
              type="text"
              className="search-input"
              placeholder="Search dishes, cuisines, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Admin Panel */}
            <Link to="/admin" className="action-pill admin-pill" title="Admin Panel">
              <BiShield className="pill-icon" />
              <span>Admin</span>
              {pendingOrdersCount > 0 && <span className="notif-dot red">{pendingOrdersCount}</span>}
            </Link>

            {/* Delivery Panel */}
            <Link to="/delivery" className="action-pill delivery-pill" title="Delivery Portal">
              <MdDeliveryDining className="pill-icon" />
              <span>Delivery</span>
              {activeDeliveryCount > 0 && <span className="notif-dot green">{activeDeliveryCount}</span>}
            </Link>

            {/* Profile Dropdown */}
            <div className="profile-dropdown-group">
              <button className="profile-pill">
                <div className="profile-avatar">
                  {user ? user.name.charAt(0).toUpperCase() : <BiUser />}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user ? user.name.split(" ")[0] : "Account"}</span>
                  <span className="profile-role">{user ? "Customer" : "Guest"}</span>
                </div>
              </button>
              <div className="profile-dropdown">
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">
                    {user ? user.name.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <p className="dropdown-user-name">{user ? user.name : "Guest User"}</p>
                    <p className="dropdown-user-email">{user ? user.email : "Not signed in"}</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                {!user && (
                  <Link to="/login" className="dropdown-item">
                    <BiUser className="di-icon" /> Login / Sign Up
                  </Link>
                )}
                <Link to="/orders" className="dropdown-item">
                  <BiShoppingBag className="di-icon" /> My Orders
                </Link>
                <Link to="/checkout" className="dropdown-item">
                  <BiCart className="di-icon" /> Quick Checkout
                </Link>
                <div className="dropdown-divider" />
                {user ? (
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <BiLogOut className="di-icon" /> Logout
                  </button>
                ) : (
                  <Link to="/login" className="dropdown-item danger">
                    <BiLogOut className="di-icon" /> Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Cart */}
            <button className="cart-pill" onClick={() => navigate("/cart")} aria-label="Cart">
              <div className="cart-icon-wrap">
                <BiCart className="cart-icon" />
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </div>
              <span className="cart-label">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <BiX /> : <BiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav Strip */}
      <nav className="navbar-nav-strip">
        <div className="nav-strip-inner">
          <NavLink to="/" end className={({ isActive }) => `nav-strip-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-strip-link ${isActive ? "active" : ""}`}>
            🍽️ Full Menu
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-strip-link ${isActive ? "active" : ""}`}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-strip-link ${isActive ? "active" : ""}`}>
            Contact & Support
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-strip-link ${isActive ? "active" : ""}`}>
            My Orders
          </NavLink>

          {/* Right side: promo tag */}
          <div className="nav-strip-promo">
            <span>🚚 Free delivery on orders above ₹499</span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Home</NavLink>
          <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Full Menu</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">About Us</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Contact</NavLink>
          <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">My Orders</NavLink>
          <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link admin">Admin Panel</NavLink>
          <NavLink to="/delivery" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link delivery">Delivery Portal</NavLink>
        </div>
      )}
    </header>
  );
};