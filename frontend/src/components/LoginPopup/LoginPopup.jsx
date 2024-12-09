import React, { useState, useContext, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axiosInstance from '../../utils/axiosConfig'; 
import { AuthContext } from '../../context/AuthContext';

const LoginPopup = () => {
  const { setShowLogin, setUsername, setShowAdd, setSuccessMessage } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [trangThai, setTrangThai] = useState('login');

  useEffect(() => {
    // Load Facebook SDK for JavaScript
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1148892766594471', // Thay bằng App ID của bạn
        cookie: true,
        xfbml: true,
        version: 'v10.0',
      });
    };

    // Tải SDK Facebook
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
          email, 
          password, 
          confirm_password: confirmPassword,
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
    }
  };

  const handleFacebookLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        console.log('Facebook login successful:', response);
        const { accessToken } = response.authResponse;

        // Gửi token cho backend của bạn để xác thực và đăng nhập
        axiosInstance.post('/facebook-login', { accessToken })
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('authToken', response.data.token);
              setUsername(response.data.username);
              setShowLogin(false);
              alert('Login successful!');
              window.location.reload();
            }
          })
          .catch(err => {
            setError('An error occurred during Facebook login.');
          });
      } else {
        setError('Facebook login failed.');
      }
    }, {scope: 'public_profile,email'});
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleLoginSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>
            {trangThai === "login" ? "Login" :
             trangThai === "register" ? "Register" :
             trangThai === "forgotPassword" ? "Reset password" :
             "Unknown State"}
          </h2>
          {/* Close Icon (Dấu "X") */}
          <span className="close-icon" onClick={() => setShowLogin(false)}>&times;</span>
        </div>

        <div className="login-popup-inputs">
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
          {trangThai === "register" && (
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          {(trangThai === "login" || trangThai === "register") && (
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
           trangThai === "forgotPassword" ? "Reset password" : "Unknown State"}
        </button>

        {trangThai === "login" && (
          <button type="button" onClick={handleFacebookLogin} className="facebook-login-btn">
            Login with Facebook
          </button>
        )}
        
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
