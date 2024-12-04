import React, { useState, useEffect, useContext } from "react";
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from "react-router-dom"; // Use navigate from react-router-dom
import jwt_decode from 'jwt-decode'; 
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin, username, setUsername }) => {
  const [menu, setMenu] = useState("home");
  const {token, setToken} = useContext(StoreContext);
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  // Logout function to remove token and update the UI immediately
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setUsername(null); // Immediately clear the username state in App
    navigate('/'); // Navigate to home
  };

  return (
    <div className="navbar">
      <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to='/menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</Link>
        <a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
        </div>
        
        {!username?<button onClick={() => setShowLogin(true)}>Sign in</button>
        :<div className="nav-bar-profile">
          <img src={assets.profile_icon} alt="" />
          <ul className="nav-profile-dropdown">
            <li><img src={assets.bag_icon} alt="" /><p>Profile</p></li>
            <hr />
            <li onClick={handleLogout}><img src={assets.logout_icon} alt="" />Logout</li>
          </ul>
        </div>
        }
        
      </div>
    </div>
  );
};

export default Navbar;
