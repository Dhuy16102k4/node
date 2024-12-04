import React from 'react'
import CategoryManagement from '../../components/ManageCatagory/CategoryManagement';

import HeaderAdmin from '../../components/headerAdmin/HeaderAdmin';
import Footer from '../../components/Footer/Footer';
const CategoryManagementApp = () => {
  return (
    <div>
      <HeaderAdmin/>
      <CategoryManagement />
      <Footer/>
    </div>
  )
}


export default CategoryManagementApp;
