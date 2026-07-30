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
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import DeliveryLogin from "./pages/DeliveryLogin/DeliveryLogin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages that need the full customer layout (Navbar + Footer)
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="main-layout">{children}</div>
    <Footer />
  </>
);

const App = () => {
  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
      <Routes>
        {/* ── Standalone login portals (NO Navbar/Footer) ── */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/delivery-login" element={<DeliveryLogin />} />

        {/* ── Protected Admin Panel ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ── Protected Delivery Portal ── */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute role="delivery">
              <Delivery />
            </ProtectedRoute>
          }
        />

        {/* ── Customer Pages (with Navbar + Footer) ── */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
        <Route path="/food/:id" element={<CustomerLayout><FoodDetail /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
        <Route path="/orders" element={<CustomerLayout><Order /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      </Routes>
    </div>
  );
};

export default App;