import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Admin from "./pages/Admin/Admin"; // Thêm Admin Page nếu cần
import ProductApp from "./pages/product/ProductApp";
import CategoryManagementApp from "./pages/category/CategoryManagementApp";
import Menu from "./pages/Menu/Menu";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || null); // Get initial username from localStorage
  const location = useLocation(); // Hook to get current path

  // Check if we are on an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Effect to check if username is removed from localStorage, then reset username state
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUsername(null);  // If token is not found, set username to null
    }
  }, []);

  return (
    <>
      {!isAdminRoute ? (
        <>
          {/* Show login popup if showLogin is true */}
          {showLogin && <LoginPopup setShowLogin={setShowLogin} setUsername={setUsername} />}
          <div className="app">
            <Navbar setShowLogin={setShowLogin} username={username} setUsername={setUsername} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<PlaceOrder />} />
            </Routes>
          </div>
          <Footer />
        </>
      ) : (
        // Admin UI
        <div className="admin">
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<ProductApp />} />
            <Route path="/admin/category" element={<CategoryManagementApp />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
