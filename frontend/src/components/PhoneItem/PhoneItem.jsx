import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import './PhoneItem.css';
import { StoreContext } from '../../context/StoreContext';

const PhoneItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, handleSendCart, formatPrice } = useContext(StoreContext);
  const currentQuantity = cartItems[id]?.quantity || 0;

  // Construct the full image URL dynamically using the updated .env variables for Vite
  const imageUrl = `${import.meta.env.VITE_API_URL}${image.replace(/\\/g, '/')}`;

  return (
    <div className="phone-item">
      <div className="phone-item-img-container">
        {/* Use the dynamically constructed image URL */}
        <img className="phone-item-image" src={imageUrl} alt={name} />

        {currentQuantity === 0 ? (
          <img className="add" onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to Cart" />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove from Cart" />
            <p>{currentQuantity}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add More" />
          </div>
        )}
      </div>
      <div className="phone-item-info">
        <div className="phone-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="phone-item-price">{formatPrice(price)}</p>
        <button onClick={() => handleSendCart(id)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default PhoneItem;
