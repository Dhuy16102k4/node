import React, { useContext, useEffect, useState } from 'react'
import './ProductAddedPopUp.css'
import { AuthContext } from '../../context/AuthContext';

const ProductAddedPopUp = () => {
    const { showAdd, setShowAdd } = useContext(AuthContext);  // Lấy giá trị showAdd từ AuthContext
    const [isFadingOut, setIsFadingOut] = useState(false);
  
    // Dùng useEffect để thay đổi trạng thái sau 1 giây và bắt đầu hiệu ứng fade-out
    useEffect(() => {
      if (showAdd) {
        const timer = setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => setShowAdd(false), 500);  // Đóng popup sau khi hiệu ứng fade-out kết thúc
        }, 1000);
        
        // Cleanup để tránh việc gọi setState khi component đã unmount
        return () => clearTimeout(timer);
      }
    }, [showAdd, setShowAdd]);
  
    if (!showAdd) {
      return null; 
    }
  
    return (
      <div className={`login-popup1 ${isFadingOut ? 'fade-out' : ''}`}>
        <form className="login-popup-container1">
          <div className="login-popup-title1">
            <p>Product added to cart</p>
          </div>
        </form>
      </div>
    );
  };
  
  export default ProductAddedPopUp;
