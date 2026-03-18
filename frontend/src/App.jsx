import React from "react";
import { Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Footer from "./components/Footer/Footer";
import Order from "./pages/Order/Order";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Order />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;