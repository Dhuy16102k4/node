import React from 'react'
import './Admin.css'
import HeaderAdmin from '../../components/admin/headerAdmin/HeaderAdmin'
import HomeAdmin from '../../components/admin/homeAdmin/HomeAdmin'
import Footer from '../../components/Footer/Footer'

const Admin = () => {
  return (
    <div>
      <HeaderAdmin/>
      <HomeAdmin/>
      <Footer/>
    </div>
  )
}

export default Admin
