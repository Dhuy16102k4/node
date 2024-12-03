import React from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined"
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined"
import { assets } from "../../assets/assets"

const HeadAdmin = ({ dark, setMode }) => {
  return (
    <>
      <section className='head'>
        <div className='container flexSB'>
          <div className='left'>
            <div className='logo'>
              <img src={assets.logo} alt='Logo' />
            </div>
          </div>
          <div className='right flexCenter'>
            <div className='search flexCenter'>
              <input type='text' placeholder='Search...' />
              <SearchOutlinedIcon className='iconHead' />
            </div>
            <NotificationsNoneOutlinedIcon className='iconHead' />
            <div className='profile flexCenter'>
              <img className='imageCircle' src='https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg' alt='' />
              <span>Huy Ngô</span>
              <KeyboardArrowDownOutlinedIcon className='iconHead' />
            </div>
            <button onClick={() => setMode(!dark)}>
              <SettingsIcon className='iconHead' />
            </button>
            {/*<button onClick={toggleStyle}>
              <SettingsIcon className='iconHead' />
              {btn}
            </button>*/}
          </div>
        </div>
      </section>
    </>
  )
}

export default HeadAdmin
