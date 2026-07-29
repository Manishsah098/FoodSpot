import { useState, useContext } from "react";
import "./Checkout.css";
import stripe from "../../assets/stripe_logo.png";
import CartTotal from "../../components/CartTotal/CartTotal";
import { FoodContext } from "../../context/FoodContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiCreditCard, BiMoney, BiMapPin, BiUser, BiEnvelope, BiPhone } from "react-icons/bi";

const Checkout = () => {
  const { getCartAmount } = useContext(FoodContext);
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
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (getCartAmount() === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!formData.firstName || !formData.phone || !formData.street) {
      toast.warning("Please fill in your delivery details.");
      return;
    }

    toast.success("🎉 Order Placed Successfully! Redirecting to orders...");
    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  };

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <h1 className="page-title">Checkout & Shipping</h1>
        <p className="page-subtitle">Complete your details to place your order</p>
      </div>

      <form className="checkout-form-grid" onSubmit={handlePlaceOrder}>
        
        {/* Left Column: Form Fields */}
        <div className="checkout-left-col">
          
          {/* Address Section */}
          <div className="checkout-card">
            <div className="card-section-title">
              <BiMapPin className="section-icon" />
              <h2>Delivery Address</h2>
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

              <div className="input-group">
                <BiMapPin className="field-icon" />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address / House No *"
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
                    defaultValue="India"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-card">
            <div className="card-section-title">
              <BiCreditCard className="section-icon" />
              <h2>Payment Options</h2>
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
            PLACE ORDER NOW
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
