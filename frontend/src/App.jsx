// src/App.jsx
import React, { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Admin from "./pages/Admin/Admin"; // Admin Page
import ProductApp from "./pages/product/ProductApp";
import CategoryManagementApp from "./pages/category/CategoryManagementApp";
import Menu from "./pages/Menu/Menu";
import { AuthContext } from "./context/AuthContext"; // AuthContext
import OrderManagementApp from "./pages/order/OrderManagementApp";
const App = () => {
  const { showLogin } = useContext(AuthContext); // Show login state from context
  const location = useLocation();

  // Check if the current route is part of the admin panel
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If we are on an admin route, no login popup should show
  if (isAdminRoute) {
    return (
      <div className="admin">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/product" element={<ProductApp />} />
          <Route path="/admin/category" element={<CategoryManagementApp />} />
          <Route path="/admin/order" element={<OrderManagementApp />} />
        </Routes>
      </div>
    );
  }

  return (
    <>
      {/* Show Login Popup only if showLogin is true */}
      {showLogin && <LoginPopup />}
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
