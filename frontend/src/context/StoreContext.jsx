import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voucher, setVoucher] = useState(null);
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

  const applyVoucher = async (voucherCode) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/voucher/apply', { voucherCode }, { headers: createHeaders() });
      if (response.data?.voucher) {
        setVoucher(response.data.voucher); // Cập nhật voucher
      } else {
        setVoucher(null);
        setError('Invalid voucher code');
      }
    } catch (err) {
      setError('Error applying voucher.');
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
    const total = Object.values(cartItems).reduce((total, item) => {
      if (item.isSelected) {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        total += price * quantity;
      }
      return total;
    }, 0);

    // Apply voucher discount
    if (voucher) {
      if (voucher.discountType === 'percentage') {
        return total - (total * voucher.discountValue / 100);
      } else if (voucher.discountType === 'fixed') {
        return total - voucher.discountValue;
      }
    }

    return total;
  };

  // Creating order
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/order/submit', orderData, { headers: createHeaders() });
      if (response.data) {
        console.log('Order created successfully:', response.data);
        setCartItems({}); // Reset cart after order is created
        setVoucher(null); // Reset voucher after order creation
      }
    } catch (err) {
      setError('Failed to create order.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <StoreContext.Provider value={{
      cartItems,
      addToCart,
      handleRemoveFromCart,
      selectItems,
      formatPrice,
      getTotalCartAmount,
      createOrder,
      applyVoucher,
      voucher,
      loading,
      error
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
