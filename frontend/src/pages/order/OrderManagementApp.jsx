import React from 'react'
import OrderManagement from '../../components/ManageOrder/OrderManagement'

import HeaderAdmin from '../../components/headerAdmin/HeaderAdmin'
import Footer from '../../components/Footer/Footer'
const OrderManagementApp = () => {
  return (
    <div>
      <HeaderAdmin/>
      <OrderManagement/>
      <Footer/>
    </div>
  )
}

export default OrderManagementApp
