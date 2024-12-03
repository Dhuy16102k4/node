import React from 'react'
import Product from '../../components/ManageProduct/product'

import HeaderAdmin from '../../components/headerAdmin/HeaderAdmin'
import Footer from '../../components/Footer/Footer'
const ProductApp = () => {
  return (
    <div>
      <HeaderAdmin/>
      <Product/>
      <Footer/>
    </div>
  )
}

export default ProductApp
