import React from 'react';
import './PhoneDisplay.css';
import PhoneItem from '../PhoneItem/PhoneItem';

const PhoneDisplay = ({ category, phoneList }) => {
  return (
    <div className="phone-display" id="phone-display">
      <h2>Check out our new products</h2>
      <div className="phone-display-list">
        {phoneList
          .filter(item => category === 'All' || category === item.category.name) // Adjust for JSON structure
          .map(item => (
            <PhoneItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.img.replace(/\\/g, '/')} // Correct image path
            />
          ))}
      </div>
    </div>
  );
};

export default PhoneDisplay;
