import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

import { product } from '../assets/assests';

export const FoodContext = createContext();

const FoodContextProvider = ({ children }) => {

    const delivery_fee = 12;
    const currency = '₹';

    
    const [products, setProducts] = useState(product);
    const [cartItems, setCartItems] = useState({})
    // const navigate = useNavigate();
    const addToCart = async(itemId) => {
        const updatedCart = { ...cartItems };
        updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
        setCartItems(updatedCart);

        console.log(`$`)

        toast.success(`${itemId} added to cart!`);
    
    }
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    }

    const updateQuantity = async(itemId, quantity) => {
        let cartData = { ...cartItems };
        cartData[itemId] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const iteminfo = products .find((product) => product._id === itemId);
            return iteminfo ? total + iteminfo.price * quantity : totalAmount;
        }, 0);
    }


    return (
        <FoodContext.Provider value={{ products,cartItems, currency,getCartCount, getCartAmount, addToCart, delivery_fee, setProducts }}>
            {children}
        </FoodContext.Provider>
    );
}

export default FoodContextProvider;