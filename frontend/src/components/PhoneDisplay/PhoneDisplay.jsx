import React from 'react';
import './PhoneDisplay.css';
import PhoneItem from '../PhoneItem/PhoneItem';

const PhoneDisplay = ({ category, phoneList }) => {
  return (
    <div className="phone-display" id="phone-display">
      <h2>Check out our new products</h2>
      <div className="phone-display-list">
        {phoneList
          .filter(item => category === 'All' || category === item.category._id) // Sửa lại để kiểm tra ID category
          .map(item => (
            <PhoneItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.img.replace(/\\/g, '/')} // Đảm bảo đường dẫn hình ảnh đúng
            />
          ))}
      </div>
    </div>
  );
};

export default PhoneDisplay;
