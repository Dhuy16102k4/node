import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState('Login');

  return (
    <div className="login-popup">
      <form action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {/* Chỉ hiển thị trường email khi ở trạng thái Forgot password */}
          {currState !== 'Login' && currState !== 'Forgot password' && (
            <input type="text" placeholder="Your Name" required />
          )}
          <input type="email" placeholder="Email" required />
          {currState !== 'Forgot password' && (
            <input type="password" placeholder="Password" required />
          )}
          {currState !== 'Login' && currState !== 'Forgot password' && (
            <input type="text" placeholder="Address" required />
          )}
        </div>
        <button>
          {currState === 'Sign Up'
            ? 'Create Account'
            : currState === 'Forgot password'
            ? 'Reset Password'
            : 'Login'}
        </button>

        {/* Hiển thị các liên kết trạng thái */}
        {currState === 'Forgot password' ? (
          <p>
            Go back to <span onClick={() => setCurrState('Login')}>Login</span>
          </p>
        ) : (
          <>
            
            {currState === 'Login' ? (
              <p>
                Create a new account{' '}
                <span onClick={() => setCurrState('Sign Up')}>Click here</span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span onClick={() => setCurrState('Login')}>Login here</span>
              </p>
            )}
            <p>
              Forgot password?{' '}
              <span onClick={() => setCurrState('Forgot password')}>
                Click here
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
