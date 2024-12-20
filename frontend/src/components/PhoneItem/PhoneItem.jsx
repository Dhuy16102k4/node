import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import styles from './PhoneItem.module.css';
import { StoreContext } from '../../context/StoreContext';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const PhoneItem = ({ id, name, price, description, image, stock, rating }) => {
  const { cartItems, addToCart, formatPrice } = useContext(StoreContext);
  const [error, setError] = useState('');  // Thêm state để lưu trữ lỗi
  const { setshowOut, setShowAdd, setSuccessMessage } = useContext(AuthContext);
  
  const token = localStorage.getItem('authToken');
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
    if(token){
      try {
        if (currentQuantity + 1 > stock || quantity + currentQuantity > stock) {
          throw new Error(`Insufficient stock. Only ${stock} items available.`);
        }
        quantity==0?await addToCart(id, 1):await addToCart(id, quantity);
  
        setSuccessMessage("Product added to Cart")
        setShowAdd(true);
        
        setError('');
      } catch (err) {
        setshowOut(true);
        
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } else {
      alert("Login before adding to cart")
    }
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      setshowOut(true);
    }
  };

  const formatPriceWithDots = (price) => {
    return price
      .toString()   // Chuyển giá trị sang chuỗi
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm sau mỗi 3 chữ số
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
      setError('');
    }
  };

  return (
    <div className={styles["phone-item"]}>
      <div className={styles["phone-item-img-container"]}>
        <Link to={`/detail/${id}`}>
          <img className={styles["phone-item-image"]} src={imageUrl} alt={name} />
        </Link>
        <div className={styles["food-item-counter"]}>
          {quantity === 0 ? (
            <img className={styles.add} onClick={() => increaseQuantity()} src={assets.add_icon_white} alt="Add to Cart" />
          ) : (
            <div className={styles["food-item-counter"]}>
              <img onClick={() => decreaseQuantity()} src={assets.remove_icon_red} alt="Remove from Cart" />
              <p id="quantity">{quantity}</p>
              <img onClick={() => increaseQuantity()} src={assets.add_icon_green} alt="Add More" />
            </div>
          )}
        </div>
      </div>
      <div className={styles["phone-item-info"]}>
        <div className={styles["phone-item-name-rating"]}>
          <p>{name}</p>
          <p>{rating != undefined ? Math.round(rating) + "⭐" : "0⭐"}</p>
        </div>
        <p className={styles["phone-item-price"]}>{formatPriceWithDots(price)} VND</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default PhoneItem;
