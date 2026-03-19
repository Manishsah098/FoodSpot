import React,{useContext} from "react";
import { FoodContext } from "../../context/FoodContext";
import './CartTotal.css'
const cartTotal = () => {
    const { getCartAmount, delivery_fee, currency } = useContext(FoodContext);
  return (
    <div>
        <div className="cart-total-container">
            <div className="cart-title">
                <h2>CART TOTAL</h2>
            </div>
            <div className="cart-details">
                <div className="cart-row">
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}</p>
                </div>
                <hr className="cart-divider"/>
                <div className="cart-row">
                    <p>Shipping Fee</p>
                 <p>{currency} {delivery_fee}</p>  
                </div>
            <div className="cart-row cart-total">
                <b>Total</b>
                <b>{currency} {getCartAmount() === 0 ? 0 : geteCartAmount() + delivery_fee} </b>
            </div>
        </div>
    </div>
  )
}

export default cartTotal