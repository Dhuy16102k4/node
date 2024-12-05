import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return price.toLocaleString();
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
      console.log(products)
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

  useEffect(() => {
    getCart();
  }, []);

  return (
    <StoreContext.Provider value={{ cartItems, addToCart, handleRemoveFromCart, selectItems, formatPrice, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
