import React, { useState, useEffect } from "react";
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from "react-router-dom"; // Use navigate from react-router-dom
import jwt_decode from 'jwt-decode'; 

const Navbar = ({ setShowLogin, username, setUsername }) => {
  const [menu, setMenu] = useState("home");
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
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
        </div>

        {username ? (
          <>
            <span>{username}</span>
            <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign in</button>  // If not logged in, show Sign in button
        )}
      </div>
    </div>
  );
};

export default Navbar;
