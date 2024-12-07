import React from 'react';
import './PhoneDisplay.css';

import { useLocation } from 'react-router-dom';
import PhoneItem from '../PhoneItem/PhoneItem';



const PhoneDisplay = ({ category, phoneList }) => {
  const location = useLocation();

  return (
    <div className="phone-display" id="phone-display">
      {location.pathname === '/'?<h2>Check out our new products</h2>:<h2>Explore our product</h2>}
      <hr />
      <div className="phone-display-list">
        {phoneList
          .filter(item => category === 'All' || category === item.category._id) // Sửa lại để kiểm tra ID category
          .map(item => (
            <PhoneItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              stock={item.stock}
              rating={item.averageRating}
              price={item.price}
              image={item.img.replace(/\\/g, '/')} // Đảm bảo đường dẫn hình ảnh đúng
            />
          ))}
      </div>
      <hr />
    </div>
  );
};

export default PhoneDisplay;
