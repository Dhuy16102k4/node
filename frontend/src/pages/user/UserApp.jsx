import React from 'react'

import HeaderAdmin from '../../components/admin/headerAdmin/HeaderAdmin'
import Footer from '../../components/Footer/Footer'
import UserManagement from '../../components/admin/ManageUser/UserManagement'
const UserApp = () => {
  return (
    <div>
      <HeaderAdmin/>
      <UserManagement/>
      <Footer/>
    </div>
  )
}

export default UserApp
