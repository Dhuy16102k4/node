import React from 'react'
import './ProductAddedPopUp.css'

const ProductAddedPopUp = ({ onClose }) => {
    useEffect(() => {
        // Đóng popup sau 2 giây
        const timer = setTimeout(() => {
        onClose(); // Gọi hàm đóng popup
        }, 2000); // Sau 2 giây sẽ đóng

        // Dọn dẹp khi component bị tháo gỡ
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="product-added-popup">
        <div className="popup-content">
            <p>Product added to cart!</p>
        </div>
        </div>
    );
};

export default ProductAddedPopUp;
