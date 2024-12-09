// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { setUnauthorizedCallback } from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [showOut, setshowOut] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for token verification
  const navigate = useNavigate();
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('user');  // Also remove user data
    setUsername(null);
    setUser(null);  // Reset user state
    setShowLogin(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // Verify token and set user state
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.username) {
          setUsername(decoded.username);
          setUser(decoded);  // Store the full decoded user
          localStorage.setItem('user', JSON.stringify(decoded));  // Save user info to localStorage
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error('Invalid token:', err);
        handleLogout();
      }
    } else {
      handleLogout();
    }

    // Register unauthorized callback to show login
    setUnauthorizedCallback(() => {
      setShowLogin(true);  // Trigger login modal on unauthorized
    });

    setLoading(false); // Token verification completed
  }, []);

  // Loading state is true while token is being verified
  if (loading) {
    return <div>Loading...</div>;  // Show a loading spinner or message
  }

  return (
    <AuthContext.Provider value={{
      user,  // User object includes role, username, etc.
      setUser,
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
