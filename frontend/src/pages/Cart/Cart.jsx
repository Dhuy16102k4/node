import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, phone_list, addToCart, removeFromCart, clearItemFromCart, formatPrice, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className="cart">
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
        {phone_list.map((item) => {
          const cartItem = cartItems[item._id];
          if (cartItem?.added) {
            return (
              <div>
                <div className="cart-items-title cart-items-item" key={item._id}>
                  <input type="checkbox" />
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatPrice(item.price)}</p>
                  <div className='quantity'>
                    <img onClick={() => removeFromCart(item._id)}  src={assets.minus_icon} alt="" />
                    <p>{cartItem.quantity}</p>
                    <img onClick={() => addToCart(item._id)} src={assets.plus_icon} alt="" />
                  </div>
                  <p>{formatPrice(item.price * cartItem.quantity)}</p>
                  <p onClick={() => clearItemFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
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
              <p>{formatPrice(getTotalCartAmount()===0?0:25000)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{formatPrice(getTotalCartAmount()===0?0:getTotalCartAmount()+25000)}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className='css'><p>đây là một text dùng để canh layout nên đừng chạm vào</p></div>
      </div>
    </div>
  );
};

export default Cart;
