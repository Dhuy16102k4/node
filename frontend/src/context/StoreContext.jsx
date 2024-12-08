import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return price.toLocaleString() + "₫";
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const createHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/cart', { headers: createHeaders() });
      const products = response?.data?.products;
      if (Array.isArray(products)) {
        const formattedCart = {};
        products.forEach(item => {
          const isSelected = typeof item.isSelected === 'boolean' ? item.isSelected : false;
          formattedCart[item.product._id] = {
            quantity: item.quantity,
            price: item.price,
            isSelected: isSelected,
            product: item.product,
          };
        });
        setCartItems(formattedCart);
      }
    } catch (err) {
      setError('Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cart/add', { productId, quantity }, { headers: createHeaders() });
      setCartItems(response.data.cart.products);
      getCart();
    } catch (err) {
      setError('Failed to add product to cart.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFromCart = async (productId, action) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cart/remove', { productId, action }, { headers: createHeaders() });
      setCartItems(response.data.cart.products);
      getCart();
      
    } catch (err) {
      setError('Failed to update cart.');
    } finally {
      setLoading(false);
    }
  };

  const selectItems = async (productId, isSelected) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/cart/selected', { productId, isSelected }, { headers: createHeaders() });
      setCartItems(response.data.cart.products);
    } catch (err) {
      setError('Failed to update selection.');
    } finally {
      setLoading(false);
    }
  };
  const getTotalCartAmount = () => {
    return Object.values(cartItems).reduce((total, item) => {
      if (item.isSelected) {
        const price = item.price || 0; // Ensure price is valid
        const quantity = item.quantity || 0;  // Ensure quantity is valid
        total += price * quantity;
      }
      return total;
    }, 0);
  };
  useEffect(() => {
    getCart();
  }, []);
//ORDER
const createOrder = async (orderData) => {
  setLoading(true);
  try {
    const response = await axiosInstance.post('/order/submit', orderData, { headers: createHeaders() });
    if (response.data) {
      console.log('Order created successfully:', response.data);
      setCartItems({});
    }
  } catch (err) {
    setError('Failed to create order.');
    console.error('Error creating order:', err);
  } finally {
    setLoading(false);
  }
};
  

  

  return (
    <StoreContext.Provider value={{ cartItems, addToCart, handleRemoveFromCart, selectItems, formatPrice,getTotalCartAmount,createOrder, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;