import React, { useState, useContext, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosConfig'; 
import { AuthContext } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginPopup = () => {
  const { setShowLogin, setUsername, setShowAdd, setSuccessMessage } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [trangThai, setTrangThai] = useState('login');
  const [code, setCode] = useState('');


  useEffect(() => {
    
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if(trangThai === "login"){
      if (!usernameInput || !password) {
        setError('Username and password are required.');
        return;
      }

      try {
        const response = await axiosInstance.post('/login/submit', {
          username: usernameInput,
          password,
        });

        if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('username', usernameInput); 

          setUsername(usernameInput); 
          setShowLogin(false);
          alert('Login successful!');
          window.location.reload();
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.message || 'Login failed. Please try again.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    } else if(trangThai === "register"){
      if(password !== confirmPassword){
        setError('Password confirm does not match, try again!');
        return;
      }

      try {
        const response = await axiosInstance.post('/register/submit', {
          username: usernameInput, 
          email: email, 
          password: password, 
          confirm_password: confirmPassword,
          phone: phone,
          address: address
        });

        setShowAdd(true);
        setSuccessMessage("Account created successfully");
        setTrangThai('login');
      } catch (error) {
        if (error.response.status === 409) {
          setError(error.response.data.error || 'Username or email already exists.');
        } else if(error.response.status === 400){
          setError(error.response.data.error || 'Password must contain at least 6 characters');
        } else {
          setError(error.message)
        }
      }
    } else if(trangThai === "forgotPassword"){
      try{
        setSuccessMessage("Loading ...")
        setShowAdd(true)
        await axiosInstance.post('/register/code', {email: email});
        setSuccessMessage("Code sended to email")
        setShowAdd(true)
        setTrangThai("resetPassword")
      } catch(error) {
          if(error.response.status === 404){
            setError("Email not found. Try again!")
          }
      }
    } else if(trangThai === "resetPassword"){
      try{
        await axiosInstance.put('/register/reset', {email: email, resetCode: code, newPassword: password});
        setSuccessMessage("Change password sucess")
        setShowAdd(true)
        setTrangThai("login")
        setPassword('')
        setCode('')
      } catch(error) {
        if(error.response.status === 400){
          setError("Code has expired!")
        } else{
          setError(error.message)
        }
        
      }
    }
  };

  const handleGoogleLogin = async (googleResponse) => {
    try {
      const { credential } = googleResponse; // The Google token (ID token)
      console.log(credential);
      // Send the Google token to your backend for verification
      const response = await axiosInstance.post('/login/loginGoogle', { accessToken: credential });

      if (response.status === 200) {
        const { token, username } = response.data;

        // Save token in localStorage
        localStorage.setItem('authToken', token);
        setUsername(username); // Update the context with the username

        // Close the login popup and show success
        setShowLogin(false);
        alert('Login successful!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Google login failed', error);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleLoginSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>
            {trangThai === "login" ? "Login" :
             trangThai === "register" ? "Register" :
             trangThai === "forgotPassword" ? "Reset password" :
             trangThai === "resetPassword" ? "Reset password" : "Unknown State"
             }
          </h2>
          {/* Close Icon (Dấu "X") */}
          <span className="close-icon" onClick={() => setShowLogin(false)}>&times;</span>
        </div>
              
        <div className="login-popup-inputs">
          {(trangThai != "forgotPassword" && trangThai != "resetPassword") && (
            <input
              type="text"
              placeholder="Username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          )}
          {(trangThai === "register" || trangThai === "forgotPassword") && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          {trangThai === "register" && (
            <input
              type="text"
              value={phone}
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}
          {trangThai === "register" && (
            <input
              type="text"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          )}
          {trangThai === "resetPassword" && (
            <input
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          )}
          {(trangThai === "login" || trangThai === "register" || trangThai === "resetPassword") && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          {trangThai === "register" && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
        </div>

        <button type="submit" id="btn-all">
          {trangThai === "login" ? "Login" :
           trangThai === "register" ? "Register" :
           trangThai === "forgotPassword" ? "Reset password" :
           trangThai === "resetPassword" ? "Change new password" : "Unknown State"}
        </button>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />

        {error && <p className="error-message">{"*" + error}</p>}

        {trangThai === "login" && (
          <p>
            Create a new account{' '}
            <span onClick={() => setTrangThai('register')} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
        )}

        {trangThai === "register" && (
          <p>
            Already have an account?{' '}
            <span onClick={() => setTrangThai('login')} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
        )}

        {trangThai !== "forgotPassword" && (
          <p>
            Forgot password?{' '}
            <span onClick={() => setTrangThai("forgotPassword")} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
        )}

        {trangThai === "forgotPassword" && (
          <p>
            Go back to login?{' '}
            <span onClick={() => setTrangThai("login")} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
        )}
        
        {/* Facebook Login Button - Only show on "login" state */}
        
      </form>
    </div>
  );
};

export default LoginPopup;
