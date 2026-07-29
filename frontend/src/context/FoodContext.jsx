import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { product } from '../assets/assests';

export const FoodContext = createContext();

const FoodContextProvider = ({ children }) => {
  const delivery_fee = 12;
  const currency = '₹';

  const [products, setProducts] = useState(product);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: "ORD-94821",
      date: "July 29, 2026",
      status: "In Transit",
      statusColor: "orange",
      total: 510,
      items: [
        { product: product[1], quantity: 1 },
        { product: product[3], quantity: 1 },
        { product: product[4], quantity: 1 },
      ],
      address: "B-402 Sunshine Heights, Green Park, New Delhi",
    },
    {
      id: "ORD-83719",
      date: "July 25, 2026",
      status: "Delivered",
      statusColor: "green",
      total: 340,
      items: [
        { product: product[0], quantity: 1 },
        { product: product[2], quantity: 1 },
      ],
      address: "B-402 Sunshine Heights, Green Park, New Delhi",
    },
  ]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('foodspot_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('foodspot_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name || 'User'}!`);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('foodspot_user');
    toast.info("Logged out successfully");
  };

  const addToCart = (itemId) => {
    const updatedCart = { ...cartItems };
    updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    setCartItems(updatedCart);

    const item = products.find((p) => p._id === itemId);
    const itemName = item ? item.name : "Item";
    toast.success(`🛒 "${itemName}" added to cart!`);
  };

  const updateQuantity = (itemId, quantity) => {
    const cartData = { ...cartItems };
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const removeFromCart = (itemId) => {
    const cartData = { ...cartItems };
    delete cartData[itemId];
    setCartItems(cartData);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
  };

  const clearCart = () => {
    setCartItems({});
  };

  const placeOrder = (shippingInfo, paymentMethod) => {
    const cartEntries = Object.entries(cartItems).filter(([, qty]) => qty > 0);
    if (cartEntries.length === 0) return null;

    const orderItems = cartEntries
      .map(([itemId, quantity]) => ({
        product: products.find((p) => p._id === itemId),
        quantity,
      }))
      .filter((i) => i.product);

    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Preparing Food",
      statusColor: "orange",
      total: getCartAmount() + delivery_fee,
      items: orderItems,
      address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipcode}`,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <FoodContext.Provider
      value={{
        products,
        setProducts,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartCount,
        getCartAmount,
        clearCart,
        delivery_fee,
        currency,
        user,
        loginUser,
        logoutUser,
        orders,
        placeOrder,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export default FoodContextProvider;