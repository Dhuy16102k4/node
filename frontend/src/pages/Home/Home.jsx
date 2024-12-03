import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import PhoneDisplay from '../../components/PhoneDisplay/PhoneDisplay';
import axiosInstance from '../../utils/axiosConfig'; // Assuming axios config is here

const Home = () => {
  const [category, setCategory] = useState('All');
  const [phoneList, setPhoneList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch products and categories from the backend
    const fetchData = async () => {
      try {
        const productsResponse = await axiosInstance.get('/');
        // const categoriesResponse = await axiosInstance.get('/category');
        
        // Set the state with the fetched data
        setPhoneList(productsResponse.data.products);
       // setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} categories={categories} />
      <PhoneDisplay category={category} phoneList={phoneList} />
    </div>
  );
};

export default Home;
