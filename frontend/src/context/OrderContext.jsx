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
      return total + item.price * item.quantity;
    }, 0);
  };

  

  useEffect(() => {
    getCart();
  }, []);

  return (
    <StoreContext.Provider value={{ cartItems, addToCart, handleRemoveFromCart, selectItems, formatPrice,getTotalCartAmount, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
// import React, { createContext, useState, useEffect } from 'react';
// import axiosInstance from '../utils/axiosConfig';

// export const StoreContext = createContext();

// const StoreProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const formatPrice = (value) => {
//     if (typeof value !== 'number' || isNaN(value)) {
//       return '₫0.00'; 
//     }
  
//     return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
//   };
  
  

//   const getAuthToken = () => {
//     return localStorage.getItem('authToken');
//   };

//   const createHeaders = () => {
//     const token = getAuthToken();
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   };

//   // Lấy giỏ hàng từ server
//   const getCart = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get('/cart', { headers: createHeaders() });
//       const products = response?.data?.products;
//       if (Array.isArray(products)) {
//         const formattedCart = {};
//         products.forEach(item => {
//           const isSelected = typeof item.isSelected === 'boolean' ? item.isSelected : false;
//           formattedCart[item.product._id] = {
//             quantity: item.quantity,
//             price: item.price,
//             isSelected: isSelected,
//             product: item.product,
//           };
//         });
//         setCartItems(formattedCart);
//       }
//     } catch (err) {
//       setError('Failed to fetch cart.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Thêm sản phẩm vào giỏ hàng
//   const addToCart = async (productId, quantity = 1) => {
//     setLoading(true);
//     try {
//       // Optimistically update the state
//       setCartItems((prevCart) => {
//         const updatedCart = { ...prevCart };
//         if (updatedCart[productId]) {
//           updatedCart[productId].quantity += quantity;
//         } else {
//           updatedCart[productId] = {
//             quantity: quantity,
//             price: updatedCart[productId]?.price || 0,
//             isSelected: false,
//             product: updatedCart[productId]?.product || {},
//           };
//         }
//         return updatedCart;
//       });

//       // Send API request to server
//       const response = await axiosInstance.post('/cart/add', { productId, quantity }, { headers: createHeaders() });
//       const addedProduct = response?.data?.cart?.products;
//       if (addedProduct) {
//         // Update state with correct data from the server response
//         setCartItems((prevCart) => {
//           const updatedCart = { ...prevCart };
//           updatedCart[addedProduct._id] = {
//             quantity: addedProduct.quantity,
//             price: addedProduct.price,
//             isSelected: addedProduct.isSelected,
//             product: addedProduct.product,
//           };
//           return updatedCart;
//         });
//       }
//     } catch (err) {
//       setError('Failed to add product to cart.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xóa sản phẩm khỏi giỏ hàng
//   const handleRemoveFromCart = async (productId, action) => {
//     setLoading(true);
//     try {
//       // Optimistically update the state
//       setCartItems((prevCart) => {
//         const updatedCart = { ...prevCart };
//         delete updatedCart[productId];
//         return updatedCart;
//       });

//       // Send API request to server
//       const response = await axiosInstance.post('/cart/remove', { productId, action }, { headers: createHeaders() });
//       const updatedCartProducts = response?.data?.cart?.products;
//       if (updatedCartProducts) {
//         setCartItems((prevCart) => {
//           const updatedCart = { ...prevCart };
//           delete updatedCart[productId];
//           return updatedCart;
//         });
//       }
//     } catch (err) {
//       setError('Failed to update cart.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cập nhật lựa chọn của sản phẩm
//   const selectItems = async (productId, isSelected) => {
//     setLoading(true);
//     try {
//       // Optimistically update the state
//       setCartItems((prevCart) => {
//         const updatedCart = { ...prevCart };
//         if (updatedCart[productId]) {
//           updatedCart[productId].isSelected = isSelected;
//         }
//         return updatedCart;
//       });

//       // Send API request to server
//       await axiosInstance.post('/cart/select', { productId, isSelected }, { headers: createHeaders() });
//     } catch (err) {
//       setError('Failed to update item selection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <StoreContext.Provider value={{
//       cartItems,
//       addToCart,
//       handleRemoveFromCart,
//       formatPrice,
//       selectItems,
//       loading,
//       getCart
//     }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreProvider;
