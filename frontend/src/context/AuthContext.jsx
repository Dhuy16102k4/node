// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { setUnauthorizedCallback } from '../utils/axiosConfig';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [showOut, setshowOut] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUsername(null);
    setShowLogin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.username) {
          setUsername(decoded.username);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error('Invalid token:', err);
        handleLogout();
      }
    }
    
    // Register unauthorized callback to show login
    setUnauthorizedCallback(() => {
      setShowLogin(true);  // Trigger login modal on unauthorized
    });
  }, []);
  
  return (
    <AuthContext.Provider value={{
      showLogin,
      setShowLogin,
      username,
      setUsername,
      handleLogout,
      showOut,
      setshowOut,
      showAdd,
      setShowAdd,
      successMessage,
      setSuccessMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
