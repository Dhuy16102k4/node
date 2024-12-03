import { createContext, useState } from 'react';
import { phone_list } from '../assets/assets';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  // Tăng số lượng sản phẩm
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + 1,
        added: prev[itemId]?.added || false, // Giữ trạng thái added
      },
    }));
  };

  // Giảm số lượng sản phẩm
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updatedQuantity = prev[itemId].quantity - 1;
      if (updatedQuantity <= 0) {
        const updatedCart = { ...prev };
        delete updatedCart[itemId]; // Xóa sản phẩm nếu số lượng <= 0
        return updatedCart;
      }
      return {
        ...prev,
        [itemId]: { ...prev[itemId], quantity: updatedQuantity },
      };
    });
  };

  const clearItemFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[itemId]; // Xóa sản phẩm khỏi giỏ hàng
      return updatedCart;
    });
  };

  const handleSendCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: prev[itemId]?.quantity || 1,
        added: true,
      },
    }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const itemId in cartItems) {
        const cartItem = cartItems[itemId];
        if (cartItem?.added) {
            let itemInfo = phone_list.find((product) => product._id === itemId);
            if (itemInfo) {
                totalAmount += itemInfo.price * cartItem.quantity;
            }
        }
    }
    return totalAmount;
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price).toLocaleString('vi-VN') + ' đ';
    } else if (price >= 1000) {
      return (price).toLocaleString('vi-VN') + ' đ';
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
    getTotalCartAmount
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
