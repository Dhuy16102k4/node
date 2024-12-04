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

  const getCart = async () => {
    setLoading(true);
    try {
      // Gọi API với headers
      const response = await axiosInstance.get('/cart', { headers: createHeaders() });
  
      // Log the full response to inspect its structure
      console.log('Full response received:', response);
  
      // Access products directly from response.data
      const products = response?.data?.products;
      console.log('Products data received:', products);  // Log products directly
  
      // Check if products data is valid
      if (!products || !Array.isArray(products) || products.length === 0) {
        setError('No valid products data found.');
        console.error('Invalid products in response:', response?.data);
        return;
      }
  
      // Format the cart data properly
      const formattedCart = {};
      products.forEach(item => {
        // Ensure the product data is valid
        if (item?.product?._id && item?.quantity != null && item?.price != null) {
          // Ensure quantity and price are valid numbers
          if (typeof item.quantity === 'number' && typeof item.price === 'number') {
            // Ensure isSelected is a boolean
            const isSelected = typeof item.isSelected === 'boolean' ? item.isSelected : false;
  
            // Format the cart item
            formattedCart[item.product._id] = {
              quantity: item.quantity,
              price: item.price,
              isSelected: isSelected,
              product: item.product  // Ensure product info is included
            };
          } else {
            console.error('Invalid quantity or price:', item);
          }
        } else {
          console.error('Invalid product data:', item);
        }
      });
  
      // Update cart state with formatted data
      setCartItems(formattedCart);
    } catch (err) {
      // Handle errors in the API call
      setError('Failed to fetch cart. Please try again.');
      console.error('Error fetching cart:', err.message || err);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  






  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cart/add',
        {
          productId,
          quantity
        },
        { headers: createHeaders() } // Gửi headers với Authorization token
      );
  
      // Cập nhật trạng thái giỏ hàng ngay lập tức
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
  const handleRemoveFromCart = async (productId, action) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cart/remove',
        {
          productId,
          action: action
        },
        { headers: createHeaders() }
      );
      setCartItems(response.data.cart.products);
      console.log('Cart updated:', response.data);
    } catch (err) {
      setError('Failed to update cart.');
      console.error('Error updating cart:', err);
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
        handleRemoveFromCart,  // Pass the correct function name here
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
