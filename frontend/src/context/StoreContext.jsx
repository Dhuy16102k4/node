import { createContext, useState, useEffect } from 'react';
import { phone_list } from '../assets/assets';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null); // Store user data

  // Effect to retrieve and parse user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    // Check if storedUser exists and is a valid JSON string
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Attempt to parse the user data
        setUser(parsedUser); // Set user state with the parsed data
      } catch (error) {
        console.error('Error parsing user data:', error); // Log error if JSON is invalid
        localStorage.removeItem('user'); // Optionally clear invalid data from localStorage
      }
    }
  }, []);

  // Add product to cart
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + 1,
        added: prev[itemId]?.added || false,
      },
    }));
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updatedQuantity = prev[itemId].quantity - 1;
      if (updatedQuantity <= 0) {
        const updatedCart = { ...prev };
        delete updatedCart[itemId]; // Remove item if quantity <= 0
        return updatedCart;
      }
      return {
        ...prev,
        [itemId]: { ...prev[itemId], quantity: updatedQuantity },
      };
    });
  };

  // Clear a specific item from the cart
  const clearItemFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[itemId]; // Remove product from cart
      return updatedCart;
    });
  };

  // Mark item as sent
  const handleSendCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: prev[itemId]?.quantity || 1,
        added: true,
      },
    }));
  };

  // Calculate the total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const cartItem = cartItems[itemId];
      if (cartItem?.added) {
        let itemInfo = phone_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem.quantity;
        }
      }
    }
    return totalAmount;
  };

  // Format price in Vietnamese format
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return price.toLocaleString('vi-VN') + ' đ';
    } else if (price >= 1000) {
      return price.toLocaleString('vi-VN') + ' đ';
    } else {
      return price.toLocaleString('vi-VN') + ' đ';
    }
  };

  const contextValue = {
    phone_list,
    cartItems,
    addToCart,
    removeFromCart,
    handleSendCart,
    formatPrice,
    clearItemFromCart,
    getTotalCartAmount,
    user, // Provide user data in context
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
