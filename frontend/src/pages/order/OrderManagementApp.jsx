import React from 'react'
import OrderManagement from '../../components/admin/ManageOrder/OrderManagement'
import HeaderAdmin from '../../components/admin/headerAdmin/HeaderAdmin'
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
