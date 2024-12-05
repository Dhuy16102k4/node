import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, addToCart, handleRemoveFromCart, formatPrice , selectItems } = useContext(StoreContext); 
  const navigate = useNavigate();

  const cartArray = Object.values(cartItems); 

  const getTotalCartAmount = () => {
    return cartArray.reduce((total, item) => {
      // Only include the price of selected items
      if (item.isSelected) {
        total += item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleRemove = (productId) => {
    handleRemoveFromCart(productId, 'remove');
  };

  const handleDecrement = (productId) => {
    handleRemoveFromCart(productId, 'decrement');
  };

  const handleSelectItem = (productId, isSelected) => {
    selectItems(productId, isSelected);
  };

  return (
    <div className="cart">
      {cartArray.length === 0 ? (
        <p>Your cart is empty</p>
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

              return (
                <div className="cart-items-title cart-items-item" key={item.product._id}>
                  <input 
                    type="checkbox" 
                    checked={item.isSelected} 
                    onChange={() => handleSelectItem(item.product._id, !item.isSelected)} 
                  />
                  <img src={imageUrl} alt={item.product.name} />
                  <p>{item.product.name}</p>
                  <p>{formatPrice(item.product.price)}</p>
                  <div className="quantity">
                    <img onClick={() => handleDecrement(item.product._id)} src={assets.minus_icon} alt="Remove" />
                    <p>{item.quantity}</p>
                    <img onClick={() => addToCart(item.product._id)} src={assets.plus_icon} alt="Add More" />
                  </div>
                  <p>{formatPrice(item.product.price * item.quantity)}</p>
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
                  <p>{formatPrice(getTotalCartAmount())}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : 25000)}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Total</p>
                  <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 25000)}</p>
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
