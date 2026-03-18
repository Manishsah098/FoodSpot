import React, { useContext, useState, useEffect } from "react";
import { FoodContext } from "../../context/FoodContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(FoodContext);

  const [cartData, setCartData] = useState([]);

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
      <div>
        <h2>Cart Items</h2>
      </div>

      <div className="cart-content-container">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item.item_id
          );

          if (!productData) return null;

          return (
            <div className="cart-item" key={index}>
              <p>{productData.name}</p>
              <p>
                {currency} {productData.price}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
          );
        })}
      </div>

      <div className="checkout-container"></div>
    </div>
  );
};

export default Cart;