import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import './PhoneItem.css';
import { StoreContext } from '../../context/StoreContext';

const PhoneItem = ({ id, name, price, description, image, stock }) => {
  const { cartItems, addToCart, formatPrice } = useContext(StoreContext);
  const [error, setError] = useState('');  // Thêm state để lưu trữ lỗi
  const currentQuantity = cartItems[id]?.quantity || 0;

  // Construct the full image URL dynamically using the updated .env variables for Vite
  const imageUrl = `${import.meta.env.VITE_API_URL}${image.replace(/\\/g, '/')}`;

  // Hàm gọi addToCart với quantity
  const handleAddToCart = async () => {
    try {
      // Kiểm tra số lượng trước khi gọi API
      if (currentQuantity + 1 > stock) {
        throw new Error(`Insufficient stock. Only ${stock} items available.`);
      }

      // Gọi addToCart với ID sản phẩm và số lượng (thêm 1 sản phẩm mỗi lần)
      await addToCart(id, currentQuantity + 1);
      setError('');  // Reset error nếu thêm vào giỏ hàng thành công
    } catch (err) {
      // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="phone-item">
      <div className="phone-item-img-container">
        {/* Use the dynamically constructed image URL */}
        <img className="phone-item-image" src={imageUrl} alt={name} />

        <div className="food-item-counter">
          {/* Hiển thị số lượng nếu có, thay vì sử dụng "+" và "-" ở đây */}
          {currentQuantity > 0 && (
            <>
              <p>{currentQuantity}</p>
            </>
          )}
        </div>
      </div>
      <div className="phone-item-info">
        <div className="phone-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="phone-item-price">{formatPrice(price)}</p>
        
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="error-message">{error}</p>}
        
        {/* Thay đổi nút Add to Cart để gọi hàm addToCart với quantity */}
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default PhoneItem;
{/* <button onClick={handleAddToCart}>
          {currentQuantity === 0 ? 'Add to Cart' : 'Add More'}
        </button> */}