import { useState, useContext, useEffect } from "react";
import "./Checkout.css";
import stripe from "../../assets/stripe_logo.png";
import CartTotal from "../../components/CartTotal/CartTotal";
import { FoodContext } from "../../context/FoodContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiCreditCard, BiMoney, BiMapPin, BiUser, BiEnvelope, BiPhone, BiCheckCircle } from "react-icons/bi";

const Checkout = () => {
  const { getCartAmount, placeOrder, user } = useContext(FoodContext);
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
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || "+91 9876543210",
        street: user.street || prev.street || "",
        city: user.city || prev.city || "",
        state: user.state || prev.state || "",
        zipcode: user.zipcode || prev.zipcode || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (getCartAmount() === 0) {
      toast.error("Your cart is empty! Add dishes before placing an order.");
      return;
    }

    if (!formData.firstName || !formData.phone || !formData.street || !formData.city) {
      toast.warning("Please complete all required delivery address fields.");
      return;
    }

    const createdOrder = placeOrder(formData, method);
    if (createdOrder) {
      toast.success(`🎉 Order #${createdOrder.id} Placed! Sent to Admin for verification.`);
      setTimeout(() => {
        navigate("/orders");
      }, 1000);
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
              <div
                onClick={() => setMethod("stripe")}
                className={`payment-card ${method === "stripe" ? "selected" : ""}`}
              >
                <div className="radio-dot"></div>
                <img src={stripe} alt="Stripe" className="stripe-img" />
              </div>

              <div
                onClick={() => setMethod("cod")}
                className={`payment-card ${method === "cod" ? "selected" : ""}`}
              >
                <div className="radio-dot"></div>
                <div className="payment-text-wrapper">
                  <BiMoney className="cod-icon" />
                  <span className="payment-title">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-right-col">
          <CartTotal />
          <button type="submit" className="place-order-btn">
            CONFIRM & PLACE ORDER
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
