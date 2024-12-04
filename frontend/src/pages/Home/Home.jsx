import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import PhoneDisplay from '../../components/PhoneDisplay/PhoneDisplay';
import axiosInstance from '../../utils/axiosConfig';  // Giả sử axios đã được cấu hình ở đây
import Pagination from '../../components/Pagination/Pagination'; 

const Home = () => {
  const [category, setCategory] = useState('All');
  const [phoneList, setPhoneList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axiosInstance.get('/', { 
          params: {
            category: category === 'All' ? '' : category, 
            page: currentPage,
            limit: 4, 
          }
        });

        setPhoneList(productsResponse.data.products);
        setTotalPages(productsResponse.data.totalPages); // Cập nhật totalPages

        const categoriesResponse = await axiosInstance.get('/category');
        setCategories(categoriesResponse.data.categories || []);  // Lấy danh mục
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, currentPage]); // Gọi lại khi category hoặc currentPage thay đổi

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} categories={categories} />
      <PhoneDisplay category={category} phoneList={phoneList} /> {/* Hiển thị sản phẩm */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        category={category} // Truyền category vào Pagination để khi thay đổi trang vẫn giữ đúng category
      />
    </div>
  );
};

export default Home;
