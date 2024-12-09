import React from 'react'


import HeaderAdmin from '../../components/admin/headerAdmin/HeaderAdmin'
import Footer from '../../components/Footer/Footer'
import VoucherManagement from '../../components/admin/Voucher/VoucherManagement'
const VoucherApp = () => {
  return (
    <div>
      <HeaderAdmin/>
      <VoucherManagement/>
      <Footer/>
    </div>
  )
}

export default VoucherApp
