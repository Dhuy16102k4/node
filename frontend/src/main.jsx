// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext.jsx'; // Import AuthContextProvider
import StoreContextProvider from './context/StoreContext.jsx'; // Import StoreContextProvider
import ErrorBoundary from './ErrorBoundary';
createRoot(document.getElementById('root')).render(
<ErrorBoundary>
  <BrowserRouter>
    <AuthContextProvider>
      <StoreContextProvider>
        <App/>
      </StoreContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
</ErrorBoundary>
)
