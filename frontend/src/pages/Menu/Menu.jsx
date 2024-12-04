import React, { useEffect, useState } from 'react'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import PhoneDisplay from '../../components/PhoneDisplay/PhoneDisplay';
import Pagination from '../../components/Pagination/Pagination'; 
import axiosInstance from '../../utils/axiosConfig';

const Menu = () => {
const [category, setCategory] = useState('All');
  const [phoneList, setPhoneList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axiosInstance.get('/menu', { 
          params: {
            category: category === 'All' ? '' : category, 
            page: currentPage,
            limit: 8, 
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
  }, [category, currentPage]);

  return (
    <div>
    <div>
      <ExploreMenu category={category} setCategory={setCategory} categories={categories} />
      <PhoneDisplay category={category} phoneList={phoneList} /> {/* Hiển thị sản phẩm */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        category={category} // Truyền category vào Pagination để khi thay đổi trang vẫn giữ đúng category
      />
    </div>
    </div>
  )
}

export default Menu
