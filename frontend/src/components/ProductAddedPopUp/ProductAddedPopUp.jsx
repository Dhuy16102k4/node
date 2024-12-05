import React, { useEffect, useContext } from 'react';
import './ProductAddedPopUp.css';
import { AuthContext } from '../../context/AuthContext';  // Import AuthContext
import { assets } from '../../assets/assets';

const ProductAddedPopUp = () => {
  const { showAdd, setShowAdd } = useContext(AuthContext);  // Lấy giá trị showAdd từ AuthContext

  // Dùng useEffect để thay đổi trạng thái sau 1 giây
  useEffect(() => {
    if (showAdd) {
      const timer = setTimeout(() => {
        setShowAdd(false);  // Đóng popup sau 1 giây
      }, 1000);
      
      // Cleanup để tránh việc gọi setState khi component đã unmount
      return () => clearTimeout(timer);
    }
  }, [showAdd, setShowAdd]);

  if (!showAdd) {
    return null; 
  }

  return (
    <div className="login-popup1">
      <form className="login-popup-container1">
        <div className="login-popup-title1">
          <p>Product added to cart</p>
        </div>
      </form>
    </div>
  );
};

export default ProductAddedPopUp;
