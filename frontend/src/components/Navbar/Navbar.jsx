// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const { setShowLogin, username, handleLogout } = useContext(AuthContext);
  const {cartItems} = useContext(StoreContext);
  const cartArray = Object.values(cartItems);
  const navigate = useNavigate();

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
          {cartArray.length > 0 ? <div className="dot"></div> : ""}
        </div>
        {!username ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="nav-bar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={() => navigate('/profile')}><img src={assets.profile_icon} alt="" /><p>Profile</p></li> {/* Added Profile option */}
              <hr />
              <li onClick={handleLogout}><img src={assets.logout_icon} alt="" />Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
