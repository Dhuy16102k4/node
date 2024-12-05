import React, { useContext, useEffect, useState } from 'react'
import './OutOfStock.css'
import { AuthContext } from '../../context/AuthContext'
import { assets } from '../../assets/assets'

const OutOfStock = () => {
    const { showOut, setshowOut } = useContext(AuthContext);  // Lấy giá trị showAdd từ AuthContext
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    // Dùng useEffect để thay đổi trạng thái sau 1 giây và bắt đầu hiệu ứng fade-out
    useEffect(() => {
        if (showOut) {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setshowOut(false), 500);  // Đóng popup sau khi hiệu ứng fade-out kết thúc
        }, 1000);
        
        // để tránh việc gọi setState khi component đã unmount
        return () => clearTimeout(timer);
        }
    }, [showOut, setshowOut]);
    
    if (!showOut) {
        return null; 
    }
    
    return (
        <div className={`login-popup2 ${isFadingOut ? 'fade-out' : ''}`}>
        <form className="login-popup-container2">
            <div className="login-popup-title2">
            <p>Product is out of stock!</p>
            </div>
        </form>
        </div>
    );

}
    

export default OutOfStock
