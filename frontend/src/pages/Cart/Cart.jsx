import React, { useContext, useState, useEffect } from "react";
import { FoodContext } from "../../context/FoodContext";
import { MdDelete } from "react-icons/md";
import CartTotal from "../../components/CartTotal/CartTotal";
import './Cart.css'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(FoodContext);

  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) return;

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
    <div>
      <h2>Cart Items</h2>

      <div className="cart-content-container">
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item.item_id
          );

          if (!productData) return null;

          return (
            <div className="cart-item" key={item.item_id}>
              <div>
                <img
                  src={productData.image}
                  alt=""
                  className="product-cart-image"
                />

                <div className="product-details-cart">
                  <p className="cart-product-name">{productData.name}</p>
                  <p className="cart-product-price">
                    {currency} {productData.price}
                  </p>
                </div>
              </div>

              <input
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="quantity-input"
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(item.item_id, Number(e.target.value))
                }
              />

              <MdDelete
                className="delete-icon"
                onClick={() => updateQuantity(item.item_id, 0)}
              />
            </div>
          );
        })}
      </div>

      <div className="checkout-container">
        <div className="checkout-box">
          <CartTotal />
          <div className="checkout-btn-container">
            <button onClick={() => navigate("/checkout")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;