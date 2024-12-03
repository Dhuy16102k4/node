import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-contain">
        <div className="footer-contain-left">
            <img src={assets.logo} alt="" />
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            <div className='footer-social-icons'>
                <a href='https://www.facebook.com/jack.phuongtuan1204/?locale=vi_VN'><img src={assets.facebook_icon} alt="" /></a>
                <a href='https://x.com/phuongtuan_j97'><img src={assets.twitter_icon} alt="" /></a>
                <a href='https://www.instagram.com/j97ee/'><img src={assets.linkedin_icon} alt="" /></a>
            </div>
        </div>
        <div className="footer-contain-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-contain-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>Phone number: 0868-655-335</li>
                <li>Email: 522H0016@student.tdtu.edu.vn</li>
            </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2024 © Sei Mobile - All rights reserved.</p>
    </div>
  )
}

export default Footer
