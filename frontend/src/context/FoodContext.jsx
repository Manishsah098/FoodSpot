import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { product as initialProducts } from '../assets/assests';

export const FoodContext = createContext();

// Sample Delivery Boys
export const DELIVERY_PARTNERS = [
  { id: "DB-101", name: "Alex Rivera", phone: "+91 98765 43210", vehicle: "Honda Activa (DL 04 AB 1234)" },
  { id: "DB-102", name: "Rahul Sharma", phone: "+91 98123 45678", vehicle: "TVS NTORQ (DL 01 XY 8899)" },
  { id: "DB-103", name: "Sameer Khan", phone: "+91 99555 12345", vehicle: "Royal Enfield (DL 09 MZ 5544)" },
];

const FoodContextProvider = ({ children }) => {
  const delivery_fee = 15;
  const currency = '₹';

  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState({});

  // Load user from localStorage — returns null if not signed in (guest)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('foodspot_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        return null;
      }
    }
    return null; // Guest by default — no session bleed with admin
  });

  const [orders, setOrders] = useState([
    {
      id: "ORD-94821",
      date: "July 30, 2026 09:30 PM",
      status: "Pending Verification",
      statusColor: "orange",
      total: 515,
      items: [
        { product: initialProducts[1], quantity: 1 },
        { product: initialProducts[3], quantity: 1 },
        { product: initialProducts[4], quantity: 1 },
      ],
      customerName: "Manish Sah",
      customerEmail: "manish.sah@example.com",
      customerPhone: "+91 9876543210",
      address: "B-402 Sunshine Heights, Green Park, New Delhi - 110016",
      paymentMethod: "cod",
      assignedDeliveryBoy: null,
    },
    {
      id: "ORD-83719",
      date: "July 30, 2026 07:15 PM",
      status: "Verified by Admin",
      statusColor: "blue",
      total: 355,
      items: [
        { product: initialProducts[0], quantity: 1 },
        { product: initialProducts[2], quantity: 1 },
      ],
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      customerPhone: "+91 98111 22334",
      address: "Flat 102, Royal Palms, Saket, New Delhi - 110017",
      paymentMethod: "stripe",
      assignedDeliveryBoy: DELIVERY_PARTNERS[0],
    },
    {
      id: "ORD-71239",
      date: "July 30, 2026 05:40 PM",
      status: "Delivered",
      statusColor: "green",
      total: 275,
      items: [
        { product: initialProducts[5], quantity: 1 },
      ],
      customerName: "Rahul Verma",
      customerEmail: "rahul@example.com",
      customerPhone: "+91 98999 88776",
      address: "C-12 Connaught Place, New Delhi - 110001",
      paymentMethod: "cod",
      assignedDeliveryBoy: DELIVERY_PARTNERS[1],
    }
  ]);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodspot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodspot_user');
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
    toast.success(`Welcome back, ${userData.name || 'User'}!`);
  };

  const logoutUser = () => {
    setUser(null);
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

  // Place order with customer autofill & initial status 'Pending Verification'
  const placeOrder = (shippingInfo, paymentMethod) => {
    const cartEntries = Object.entries(cartItems).filter(([, qty]) => qty > 0);
    if (cartEntries.length === 0) return null;

    const orderItems = cartEntries
      .map(([itemId, quantity]) => ({
        product: products.find((p) => p._id === itemId),
        quantity,
      }))
      .filter((i) => i.product);

    const fullName = `${shippingInfo.firstName} ${shippingInfo.lastName || ''}`.trim();

    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "Pending Verification",
      statusColor: "orange",
      total: getCartAmount() + delivery_fee,
      items: orderItems,
      customerName: fullName,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipcode}`,
      paymentMethod,
      assignedDeliveryBoy: null,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Admin action: Verify order & assign delivery partner → auto-advances to "Out for Delivery"
  const assignDeliveryPartner = (orderId, deliveryPartnerObj) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          toast.success(`Order #${orderId} assigned to ${deliveryPartnerObj.name} — Out for Delivery!`);
          return {
            ...ord,
            status: "Out for Delivery",
            statusColor: "purple",
            assignedDeliveryBoy: deliveryPartnerObj,
          };
        }
        return ord;
      })
    );
  };

  // Update order status (Admin or Delivery Boy action)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          let color = "orange";
          if (newStatus === "Verified by Admin") color = "blue";
          if (newStatus === "Out for Delivery") color = "purple";
          if (newStatus === "Delivered") color = "green";
          if (newStatus === "Cancelled") color = "red";

          toast.info(`Order #${orderId} updated to "${newStatus}"`);
          return {
            ...ord,
            status: newStatus,
            statusColor: color,
          };
        }
        return ord;
      })
    );
  };

  const [bannerText, setBannerText] = useState(() => {
    return localStorage.getItem('foodspot_banner') || "⚡ FAST DELIVERY | 20% OFF ON FIRST ORDER WITH CODE: FOOD20";
  });

  const updateBannerText = (newText) => {
    setBannerText(newText);
    localStorage.setItem('foodspot_banner', newText);
    toast.success("Website announcement banner updated!");
  };

  // Admin action: Add new product
  const addProduct = (newProduct) => {
    setProducts((prev) => [
      {
        ...newProduct,
        _id: "p_" + Date.now(),
        rating: Number(newProduct.rating) || 4.5,
        outOfStock: false,
      },
      ...prev,
    ]);
    toast.success(`Added "${newProduct.name}" to menu!`);
  };

  // Admin action: Edit existing product
  const editProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, ...updatedFields } : p))
    );
    toast.success(`Updated "${updatedFields.name || "Dish"}"!`);
  };

  // Admin action: Toggle Out of Stock status
  const toggleProductStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId) {
          const nextState = !p.outOfStock;
          toast.info(`"${p.name}" is now ${nextState ? "Out of Stock" : "In Stock"}`);
          return { ...p, outOfStock: nextState };
        }
        return p;
      })
    );
  };

  // Admin action: Delete product
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    toast.info("Product removed from menu.");
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
        setUser,
        loginUser,
        logoutUser,
        orders,
        placeOrder,
        assignDeliveryPartner,
        updateOrderStatus,
        addProduct,
        editProduct,
        toggleProductStock,
        deleteProduct,
        bannerText,
        updateBannerText,
        DELIVERY_PARTNERS,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export default FoodContextProvider;