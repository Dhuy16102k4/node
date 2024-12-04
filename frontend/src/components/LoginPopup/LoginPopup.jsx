// src/components/LoginPopup/LoginPopup.jsx
import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosConfig'; // Import axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const LoginPopup = () => {
  const { setShowLogin, setUsername } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!usernameInput || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axiosInstance.post('/login/submit', {
        username: usernameInput,
        password,
      });

      console.log('Response:', response);  // Log the response to inspect data

      if (response.status === 200) {
        // Save token and username in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', usernameInput); // Save username
        console.log('Token saved:', response.data.token); // Log token to verify

        // Update the username state in AuthContext and close the login popup
        setUsername(usernameInput); 
        setShowLogin(false); // Close the login popup
        alert('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error); 
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleLoginSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="login-popup-inputs">
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>

        {error && <p className="error-message">{error}</p>}

        <p>
          Forgot password?{' '}
          <span onClick={() => alert('Forgot password functionality not implemented yet.')} style={{ cursor: 'pointer', color: 'blue' }}>
            Click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
