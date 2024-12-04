import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';  // Giả sử axiosInstance đã được cấu hình

// Tạo context
export const StoreContext = createContext(); 

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Định dạng giá
  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  // Lấy token từ localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Lấy token từ localStorage
  };

  // Hàm tạo headers bao gồm Authorization token
  const createHeaders = () => {
    const token = getAuthToken();  // Lấy token từ localStorage
    return {
      'Authorization': `Bearer ${token}`,  // Thêm token vào headers
      'Content-Type': 'application/json',   // Đảm bảo rằng content-type là json
    };
  };

  // Lấy giỏ hàng từ server
  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/cart', { headers: createHeaders() });  // Gọi API với headers
      const cart = response.data.cart;
      const formattedCart = {};

      cart.products.forEach(item => {
        formattedCart[item.product._id] = {
          quantity: item.quantity,
          price: item.price,
          isSelected: item.isSelected
        };
      });

      setCartItems(formattedCart);
    } catch (err) {
      setError('Failed to fetch cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cart/add', 
        { 
          productId, 
          quantity 
        },
        { headers: createHeaders() }  // Gửi headers với Authorization token
      );

      setCartItems(response.data.cart.products);
      console.log('Product added to cart:', response.data);
    } catch (err) {
      setError('Failed to add product to cart.');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/cart/remove/${productId}`, 
        { headers: createHeaders() }  // Gửi headers với Authorization token
      );
      setCartItems(response.data.cart.products);
      console.log('Product removed from cart:', response.data);
    } catch (err) {
      setError('Failed to remove product from cart.');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái chọn sản phẩm trong giỏ hàng
  const selectItems = async (productId, isSelected) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/cart/selected', {
        productId,
        isSelected
      }, 
      { headers: createHeaders() }  // Gửi headers với Authorization token
      );
      setCartItems(response.data.cart.products);
      console.log('Product selection updated:', response.data);
    } catch (err) {
      setError('Failed to update product selection.');
      console.error('Error updating selection:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi giỏ hàng
  const handleSendCart = async () => {
    try {
      const response = await axiosInstance.post('/cart/send', {
        cartItems
      }, 
      { headers: createHeaders() }  // Gửi headers với Authorization token
      );
      console.log('Cart sent successfully:', response.data);
    } catch (err) {
      setError('Failed to send cart.');
      console.error('Error sending cart:', err);
    }
  };

  useEffect(() => {
    getCart();  // Khi component load, gọi API để lấy giỏ hàng
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        selectItems,
        formatPrice,
        handleSendCart,
        loading,
        error
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
