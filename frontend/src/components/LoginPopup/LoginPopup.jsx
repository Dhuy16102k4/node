import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosConfig'; // Import axios instance

const LoginPopup = ({ setShowLogin, setUsername }) => {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    // Validate inputs
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/login/submit', {
        username,
        password,
      });
      
      console.log('Response:', response);  // Log the response to inspect data
  
      if (response.status === 200) {
        // Save token in localStorage
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved:', response.data.token); // Log token to verify

        // Update the username state in the parent component and close the login popup
        setUsername(username); 
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
          />
        </div>
        <div className="login-popup-inputs">
          <input
            type="text"
            placeholder="Username"
            value={username}
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
          <span onClick={() => setCurrState('Forgot password')}>Click here</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
