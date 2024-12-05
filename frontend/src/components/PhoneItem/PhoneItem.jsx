import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import './PhoneItem.css';
import { StoreContext } from '../../context/StoreContext';
import { AuthContext } from '../../context/AuthContext';

const PhoneItem = ({ id, name, price, description, image, stock }) => {
  const { cartItems, addToCart, formatPrice } = useContext(StoreContext);
  const [error, setError] = useState('');  // Thêm state để lưu trữ lỗi
  const { setshowOut, setShowAdd } = useContext(AuthContext);

  // Lấy số lượng từ cartItems hoặc 0 nếu không có trong giỏ
  let currentQuantity = cartItems[id]?.quantity || 0;

  // Lưu trữ số lượng vào state
  const [quantity, setQuantity] = useState(0);

  // Construct the full image URL dynamically using the updated .env variables for Vite
  const imageUrl = `${import.meta.env.VITE_API_URL}${image.replace(/\\/g, '/')}`;

  // Lưu số lượng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem(`product_${id}_quantity`, quantity);
  }, [quantity, id]);

  
  useEffect(() => {
    const savedQuantity = localStorage.getItem(`product_${id}_quantity`);
    if (savedQuantity) {
      setQuantity(Number(savedQuantity)); // Chuyển về kiểu số nếu có giá trị
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (currentQuantity + 1 > stock || quantity + currentQuantity > stock) {
        throw new Error(`Insufficient stock. Only ${stock} items available.`);
      }
      quantity==0?await addToCart(id, 1):await addToCart(id, quantity);
      
      setShowAdd(true);
      setError('');
    } catch (err) {
      setshowOut(true);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      setshowOut(true);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
      setError('');
    }
  };

  return (
    <div className="phone-item">
      <div className="phone-item-img-container">
        <img className="phone-item-image" src={imageUrl} alt={name} />

        <div className="food-item-counter">
          {quantity === 0 ? (
            <img className="add" onClick={() => increaseQuantity()} src={assets.add_icon_white} alt="Add to Cart" />
          ) : (
            <div className="food-item-counter">
              <img onClick={() => decreaseQuantity()} src={assets.remove_icon_red} alt="Remove from Cart" />
              <p>{quantity}</p>
              <img onClick={() => increaseQuantity()} src={assets.add_icon_green} alt="Add More" />
            </div>
          )}
        </div>
      </div>
      <div className="phone-item-info">
        <div className="phone-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="phone-item-price">{formatPrice(price)}</p>
        
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default PhoneItem;
