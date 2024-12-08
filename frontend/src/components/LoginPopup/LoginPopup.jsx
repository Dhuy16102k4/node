// src/components/LoginPopup/LoginPopup.jsx
import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosConfig'; // Import axios instance
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const LoginPopup = () => {
  const { setShowLogin, setUsername, setShowAdd, setSuccessMessage } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [trangThai, setTrangThai] = useState('login');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if(trangThai == "login"){
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
          window.location.reload();
        }
      } catch (error) {
          console.error('Login error:', error); 
          if (error.response && error.response.data) {
          setError(error.response.data.message || 'Login failed. Please try again.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    }else if(trangThai == "register"){
      try{
        if(password != confirmPassword){
          setError('Password confirm is not match, try again!');
          return;
        }

        const response = await axiosInstance.post('/register/submit', {
        username: usernameInput, 
        email, 
        password, 
        confirm_password: confirmPassword,
      });

      setShowAdd(true);
      setSuccessMessage("Create account success");
      setTrangThai('login');
      }catch (error){
        if (error.response.status === 409) {
          // Display the specific error message for username or email conflict
          setError(error.response.data.error || 'Username or email already exists.');
        } else if(error.response.status === 400){
          setError(error.response.data.error || 'Password must contain at least 6 characters');
        } else {
          setError(error.message)
        }
      }
    }
  };

  return (

      
        <div className="login-popup">
          <form onSubmit={handleLoginSubmit} className="login-popup-container">
            <div className="login-popup-title">
              <h2>
                {(() => {
                  if (trangThai === "login") {
                    return "Login";
                  } else if (trangThai === "register") {
                    return "Register";
                  } else if (trangThai === "forgotPassword") {
                    return "Reset password";
                  } else {
                    return "Unknown State";
                  }
                })()}
              </h2>
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
              {trangThai=="register"?
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              :
              null
              }
              {(trangThai=="login" || trangThai =="register")?
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              :
              null
              }
              {trangThai =="register"?
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              :
              null
              }
            </div>
            <button type="submit">
            {(() => {
                if (trangThai === "login") {
                  return "Login";
                } else if (trangThai === "register") {
                  return "Register";
                } else if (trangThai === "forgotPassword") {
                  return "Reset password";
                } else {
                  return "Unknown State";
                }
              })()}
            </button>
          
          
          {error && <p className="error-message">{"*" + error}</p>}
          
          {trangThai == "login"?
          <p>
            Create new account{' '}
            <span onClick={() => setTrangThai('register')} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
          :
          null
          }
          
          {trangThai == "register"?
            <p>
            Already have an account?{' '}
            <span onClick={() => setTrangThai('login')} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
            </p>
            :
            null
          }

          {trangThai != "forgotPassword"?
            <p>
            Forgot password?{' '}
            <span onClick={() => setTrangThai("forgotPassword")} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
          :
          null
          }

          {trangThai == "forgotPassword"?
            <p>
            Go back to login?{' '}
            <span onClick={() => setTrangThai("login")} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
          :
          null
          }
        </form>
      </div>
  );
};

export default LoginPopup;
