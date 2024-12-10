// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext.jsx'; // Import AuthContextProvider
import StoreContextProvider from './context/StoreContext.jsx'; // Import StoreContextProvider
import ErrorBoundary from './ErrorBoundary';
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
<ErrorBoundary>
  <BrowserRouter>
    <AuthContextProvider>
      <StoreContextProvider>
        <GoogleOAuthProvider clientId="307009663199-msjfht1qmaqca6d3ncp9ld5p5nl3ottf.apps.googleusercontent.com">
          <App/>
        </GoogleOAuthProvider>
      </StoreContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
</ErrorBoundary>
)
