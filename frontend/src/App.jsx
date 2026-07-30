import React from "react";
import { Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Footer from "./components/Footer/Footer";
import Order from "./pages/Order/Order";
import Menu from "./pages/Menu/Menu";
import FoodDetail from "./pages/FoodDetail/FoodDetail";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Admin from "./pages/Admin/Admin";
import Delivery from "./pages/Delivery/Delivery";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
      <Navbar />
      <div className="main-layout">
        <Routes>
          {/* Customer Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/food/:id" element={<FoodDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/login" element={<Login />} />
          {/* Admin & Delivery Panels */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/delivery" element={<Delivery />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;