import React, { useState, useEffect } from 'react';
import './PhoneDisplay.css';
import { useLocation } from 'react-router-dom';
import PhoneItem from '../PhoneItem/PhoneItem';

const PhoneDisplay = ({ category, phoneList }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Dùng useEffect để lấy từ khóa tìm kiếm từ URL nếu có
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location]);

  // Lọc danh sách sản phẩm theo tên sản phẩm và theo category
  const filteredPhoneList = phoneList
    .filter(item => 
      (category === 'All' || category === item.category._id) && 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="phone-display" id="phone-display">
      {location.pathname === '/' ? (
        <h2>Check out our new products</h2>
      ) : (
        <h2>Explore our product</h2>
      )}
      <hr />
      <div className={`phone-display-list ${filteredPhoneList.length === 0 ? 'empty' : ''}`}>
      {filteredPhoneList.length === 0 ? (
          <div>No products found</div> // Thông báo không tìm thấy sản phẩm
        ) : (
          filteredPhoneList.map(item => (
            <PhoneItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              stock={item.stock}
              rating={item.averageRating}
              price={item.price}
              image={item.img.replace(/\\/g, '/')} // Ensure correct image path
            />
          ))
        )
      }
      </div>
      <hr />
      {/* Pagination here */}
    </div>
  );
};

export default PhoneDisplay;
