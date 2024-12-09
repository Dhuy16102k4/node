import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
  const { cartItems, addToCart, handleRemoveFromCart, formatPrice, selectItems } = useContext(StoreContext); 
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { setshowOut } = useContext(AuthContext);

  // Convert cartItems to an array of items for easier mapping
  const cartArray = Object.values(cartItems);

  // Ensure that the cart items are loaded and not empty before rendering
  useEffect(() => {
    if (cartArray.length === 0) {
      console.log("Cart is empty or not initialized properly.");
    }
  }, [cartItems]);

  // Calculate the total amount of selected items in the cart
  const getTotalCartAmount = () => {
    return cartArray.reduce((total, item) => {
      if (item.isSelected) {
        const price = item.product?.price || 0; 
        const quantity = item.quantity || 0;  
        total += price * quantity;
      }
      return total;
    }, 0);
  };

  // Remove item from cart
  const handleRemove = (productId) => {
    handleRemoveFromCart(productId, 'remove');
  };

  // Decrement item quantity
  const handleDecrement = (productId) => {
    handleRemoveFromCart(productId, 'decrement');
  };

  // Toggle item selection
  const handleSelectItem = (productId, isSelected) => {
    selectItems(productId, isSelected);
  };

  const handleAddToCart = async (id, currentQuantity, stock) => {
    try {
      // Kiểm tra số lượng trước khi gọi API
      if (currentQuantity + 1 > stock) {
        throw new Error(`Insufficient stock. Only ${stock} items available.`);
      }

      // Gọi addToCart với ID sản phẩm và số lượng (thêm 1 sản phẩm mỗi lần)
      await addToCart(id);
      setError('');  // Reset error nếu thêm vào giỏ hàng thành công
    } catch (err) {
      setshowOut(true);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="cart">
      {cartArray.length === 0 ? (
        <div className="empty-cart">
          <a href="/menu"><img 
            src="https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" 
            alt="Empty Cart" 
            className="empty-cart-image" 
          /></a>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Select</p>
              <p>Items</p>
              <p>Name</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            
            {cartArray.map((item) => {
              const imageUrl = item.product?.img
                ? `${import.meta.env.VITE_API_URL}${item.product.img.replace(/\\/g, '/')}`
                : assets.default_image;

              // Ensure that each item has a valid key
              const key = item.product?._id || item.product?.name || Math.random().toString(36).substring(7);

              return (
                <div 
                  key={key}  // Ensure the key is unique
                  className="cart-items-item"
                >
                  <input 
                    type="checkbox" 
                    checked={item.isSelected} 
                    onChange={() => handleSelectItem(item.product._id, !item.isSelected)} 
                  />
                  <img src={imageUrl} alt={item.product.name} />
                  <p>{item.product.name}</p>
                  <p>{formatPrice(item.product?.price || 0)}</p> {/* Ensure price is a number */}
                  <div className="quantity">
                    <img onClick={() => handleDecrement(item.product._id)} src={assets.minus_icon} alt="Remove" />
                    <p>{item.quantity}</p>
                    <img onClick={() => handleAddToCart(item.product._id, item.quantity, item.product.stock)} src={assets.plus_icon} alt="Add More" />
                  </div>
                  <p>{formatPrice(item.product?.price * item.quantity || 0)}</p> {/* Ensure total is calculated properly */}
                  <p onClick={() => handleRemove(item.product._id)} className="cross">x</p>
                </div>
              );
            })}
          </div>
          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>{formatPrice(getTotalCartAmount())}</p> {/* Use calculated total */}
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : 25000)}</p> {/* Delivery fee */}
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Total</p>
                  <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 25000)}</p> {/* Total with delivery fee */}
                </div>
              </div>
              <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

