<<<<<<< HEAD
// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { setShowLogin, username, handleLogout } = useContext(AuthContext);
=======
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
>>>>>>> bb8f74c4f58a1ec6972a621fd66290bfc3a18f89

  return (
    <div className="navbar">
      <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' className={window.location.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to='/menu' className={window.location.pathname === "/menu" ? "active" : ""}>Menu</Link>
        <a href='#footer' className={window.location.hash === "#footer" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
        </div>
<<<<<<< HEAD

=======
        
>>>>>>> bb8f74c4f58a1ec6972a621fd66290bfc3a18f89
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
<<<<<<< HEAD
=======
        
>>>>>>> bb8f74c4f58a1ec6972a621fd66290bfc3a18f89
      </div>
    </div>
  );
};

export default Navbar;
