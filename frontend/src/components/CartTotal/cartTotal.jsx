import React, { useContext } from "react";
import { FoodContext } from "../../context/FoodContext";
import "./CartTotal.css";
import { BiReceipt, BiTagAlt } from "react-icons/bi";

function CartTotal() {
  const { getCartAmount, delivery_fee, currency } = useContext(FoodContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="cart-summary-card">
      <div className="summary-header">
        <BiReceipt className="summary-header-icon" />
        <h3>Order Summary</h3>
      </div>

      <div className="summary-rows">
        <div className="summary-row">
          <span className="label">Subtotal</span>
          <span className="val">{currency} {subtotal}</span>
        </div>

        <div className="summary-row">
          <span className="label">Estimated Delivery Fee</span>
          <span className="val">{subtotal === 0 ? `${currency} 0` : `${currency} ${delivery_fee}`}</span>
        </div>

        <div className="promo-box">
          <BiTagAlt className="promo-icon" />
          <input type="text" placeholder="Promo code" className="promo-input" />
          <button className="promo-btn">Apply</button>
        </div>

        <hr className="summary-divider" />

        <div className="summary-row total-row">
          <span className="total-label">Total Amount</span>
          <span className="total-val">{currency} {total}</span>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;