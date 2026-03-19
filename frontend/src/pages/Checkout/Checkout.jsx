import { useState } from "react";
import "./Checkout.css";
import stripe from "../../assets/stripe_logo.png";
import CartTotal from "../../components/CartTotal/CartTotal";

const Checkout = () => {
  const [method, setmethod] = useState("cod");
  return (
    <div>
      <div className="form-container">
        <div className="form-left">
          <fieldset className="payment-method">
            <legend>Payment Options</legend>
            <div className="payment-options">
              <div
                onClick={() => setmethod("stripe")}
                className={`payment-option ${method === "stripe" ? "selected" : ""}`}
              >
                <img src={stripe} alt="" />
              </div>
              <div
                onClick={() => setmethod("cod")}
                className={`payment-option ${method === "cod" ? "selected" : ""}`}
              >
                <span className="payment-text"> CASH ON DELIVERY</span>
              </div>
            </div>
          </fieldset>

          <div className="form-title">
            <h2>Shipping Address </h2>
          </div>
          <div className="form-row">
            <input
              type="text"
              className="form-input"
              placeholder="First Name"
            />
            <input type="text" className="form-input" placeholder="Last Name" />
          </div>
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
          />
          <input
            type="text"
            className="form-input"
            placeholder="Phone Number"
          />
          <input
            type="text"
            className="form-input"
            placeholder="Street Address"
          />
          <div className="form-row">
            <input type="text" className="form-input" placeholder="city" />
            <input type="text" className="form-input" placeholder="state" />
          </div>
          <div className="form-row">
            <input type="text" className="form-input" placeholder="Zipcode" />
            <input type="text" className="form-input" placeholder="Country" />
          </div>
        </div>
        <div className="form-right">
          <CartTotal />
          <div className="form-submit">
            <button type="submit" className="submit">
              {" "}
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
