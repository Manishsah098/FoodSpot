import React, { useContext, useState, useEffect } from "react";
import { FoodContext } from "../../context/FoodContext";
import { MdDeleteOutline, MdArrowForward } from "react-icons/md";
import { BiPlus, BiMinus, BiShoppingBag } from "react-icons/bi";
import CartTotal from "../../components/CartTotal/CartTotal";
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount } = useContext(FoodContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!products || products.length === 0) return;
    if (!cartItems || typeof cartItems !== "object") {
      setCartData([]);
      return;
    }

    const tempData = Object.entries(cartItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        item_id: itemId,
        quantity: quantity,
      }));

    setCartData(tempData);
  }, [cartItems, products]);

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1 className="page-title">Your Shopping Cart</h1>
        <p className="page-subtitle">Review items before proceeding to checkout</p>
      </div>

      {cartData.length > 0 ? (
        <div className="cart-layout-grid">
          
          <div className="cart-items-section">
            <div className="items-table-header">
              <span>Dish</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            <div className="items-list">
              {cartData.map((item) => {
                const productData = products.find((product) => product._id === item.item_id);
                if (!productData) return null;

                const itemTotal = productData.price * item.quantity;

                return (
                  <div className="cart-item-card" key={item.item_id}>
                    
                    <div className="item-info-col">
                      <img src={productData.image} alt={productData.name} className="cart-item-img" />
                      <div className="item-meta">
                        <span className="item-category-pill">{productData.category}</span>
                        <h4 className="item-name">{productData.name}</h4>
                      </div>
                    </div>

                    <div className="item-price-col">
                      {currency} {productData.price}
                    </div>

                    <div className="item-qty-col">
                      <div className="qty-stepper">
                        <button
                          className="stepper-btn"
                          onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
                        >
                          <BiMinus />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="stepper-btn"
                          onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                        >
                          <BiPlus />
                        </button>
                      </div>
                    </div>

                    <div className="item-total-col">
                      {currency} {itemTotal}
                    </div>

                    <div className="item-action-col">
                      <button
                        className="delete-item-btn"
                        onClick={() => updateQuantity(item.item_id, 0)}
                        title="Remove item"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-summary-section">
            <CartTotal />
            <button className="proceed-checkout-btn" onClick={() => navigate("/checkout")}>
              <span>Proceed to Checkout</span>
              <MdArrowForward className="btn-icon" />
            </button>
          </div>

        </div>
      ) : (
        <div className="empty-cart-view">
          <div className="empty-bag-icon">
            <BiShoppingBag />
          </div>
          <h2>Your Cart is Currently Empty</h2>
          <p>Looks like you haven't added any delicious food to your cart yet.</p>
          <button className="browse-menu-btn" onClick={() => navigate("/")}>
            Explore Our Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;