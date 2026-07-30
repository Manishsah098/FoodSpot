import { useState, useContext, useEffect } from "react";
import "./Checkout.css";
import CartTotal from "../../components/CartTotal/CartTotal";
import { FoodContext } from "../../context/FoodContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiCreditCard, BiMoney, BiMapPin, BiUser, BiEnvelope, BiPhone, BiCheckCircle } from "react-icons/bi";
import { FaCreditCard } from "react-icons/fa";
import axios from "axios";

const BACKEND_URL = "http://localhost:4000";

const Checkout = () => {
  const { getCartAmount, placeOrder, user, cartItems, foodList, clearCart } = useContext(FoodContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
  });

  const navigate = useNavigate();

  // Auto-fill user details when user is logged in
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(" ") || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Build order items from cart
  const buildOrderItems = () => {
    return Object.entries(cartItems || {}).flatMap(([id, sizes]) =>
      Object.entries(sizes || {}).map(([size, qty]) => {
        const food = foodList?.find((f) => f._id === id || f.id === id);
        return food ? { ...food, quantity: qty, size } : null;
      }).filter(Boolean)
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (getCartAmount() === 0) {
      toast.error("Your cart is empty! Add dishes before placing an order.");
      return;
    }
    if (!formData.firstName || !formData.phone || !formData.street || !formData.city) {
      toast.warning("Please complete all required delivery address fields.");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    const userId = user?.id || user?._id || "guest";
    const items = buildOrderItems();
    const amount = getCartAmount();

    if (method === "stripe") {
      // ── Stripe Checkout Session ──
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/order/stripe`,
          { userId, items, amount, address: formData },
          { headers: { token: userToken } }
        );
        if (res.data.success && res.data.session_url) {
          // Redirect to Stripe hosted checkout page
          window.location.href = res.data.session_url;
        } else {
          toast.error(res.data.message || "Failed to initiate Stripe payment");
        }
      } catch {
        toast.error("Server unavailable. Please use Cash on Delivery.");
      }
    } else {
      // ── Cash on Delivery ──
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/order/place`,
          { userId, items, amount, address: formData },
          { headers: { token: userToken } }
        );
        if (res.data.success) {
          clearCart?.();
          toast.success("🎉 Order placed! Sent to admin for verification.");
          navigate("/orders");
        } else {
          // Fallback local order
          const createdOrder = placeOrder(formData, method);
          if (createdOrder) {
            toast.success(`🎉 Order Placed! (offline mode)`);
            navigate("/orders");
          }
        }
      } catch {
        // Offline fallback
        const createdOrder = placeOrder(formData, method);
        if (createdOrder) {
          toast.success("🎉 Order Placed! (offline mode)");
          navigate("/orders");
        }
      }
    }
  };

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <h1 className="page-title">Checkout & Order Placement</h1>
        <p className="page-subtitle">Personal details auto-filled for your account. Complete delivery address and payment choice.</p>
      </div>

      {user && (
        <div className="autofill-notice-card">
          <BiCheckCircle className="notice-icon" />
          <div>
            <h4>Personal Details Pre-filled</h4>
            <p>Logged in as <strong>{user.name}</strong> ({user.email}). Just enter delivery location & choose payment!</p>
          </div>
        </div>
      )}

      <form className="checkout-form-grid" onSubmit={handlePlaceOrder}>
        
        {/* Left Column: Form Fields */}
        <div className="checkout-left-col">
          
          {/* Personal Info & Address Section */}
          <div className="checkout-card">
            <div className="card-section-title">
              <BiUser className="section-icon" />
              <h2>1. Contact & Personal Info (Auto-Filled)</h2>
            </div>

            <div className="form-fields">
              <div className="form-row-2">
                <div className="input-group">
                  <BiUser className="field-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <BiUser className="field-icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="input-group">
                  <BiEnvelope className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <BiPhone className="field-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Location Section */}
          <div className="checkout-card">
            <div className="card-section-title">
              <BiMapPin className="section-icon" />
              <h2>2. Delivery Location</h2>
            </div>

            <div className="form-fields">
              <div className="input-group">
                <BiMapPin className="field-icon" />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address / Building / Flat No *"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    name="state"
                    placeholder="State *"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Zip / Postal Code *"
                    required
                    value={formData.zipcode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-card">
            <div className="card-section-title">
              <BiCreditCard className="section-icon" />
              <h2>3. Payment Method</h2>
            </div>

            <div className="payment-options-grid">
              {/* Stripe / Card Payment */}
              <div
                onClick={() => setMethod("stripe")}
                className={`payment-card ${method === "stripe" ? "selected" : ""}`}
              >
                <div className="radio-dot" />
                <div className="payment-text-wrapper">
                  <FaCreditCard className="cod-icon stripe-icon" />
                  <div>
                    <span className="payment-title">Pay Online</span>
                    <span className="payment-subtitle">Stripe — Cards, UPI, Netbanking</span>
                  </div>
                </div>
                {method === "stripe" && (
                  <span className="payment-badge">Secure 🔒</span>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setMethod("cod")}
                className={`payment-card ${method === "cod" ? "selected" : ""}`}
              >
                <div className="radio-dot" />
                <div className="payment-text-wrapper">
                  <BiMoney className="cod-icon" />
                  <div>
                    <span className="payment-title">Cash on Delivery</span>
                    <span className="payment-subtitle">Pay when your order arrives</span>
                  </div>
                </div>
              </div>
            </div>

            {method === "stripe" && (
              <div className="stripe-info-box">
                <p>🔐 You'll be redirected to Stripe's secure checkout to complete payment with your card, UPI, or netbanking.</p>
                <p className="stripe-test-note">Test card: <code>4242 4242 4242 4242</code> · Any future date · Any CVV</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-right-col">
          <CartTotal />
          <button type="submit" className="place-order-btn">
            {method === "stripe" ? "💳 PROCEED TO PAYMENT" : "✅ PLACE ORDER (COD)"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
