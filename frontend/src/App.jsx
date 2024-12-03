import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Admin from "./pages/Admin/Admin"; // Thêm Admin Page nếu cần
import ProductApp from "./pages/product/ProductApp";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  // Kiểm tra nếu đang ở route admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Giao diện cho người dùng thông thường */}
      {!isAdminRoute ? (
        <>
          {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
          <div className="app">
            <Navbar setShowLogin={setShowLogin} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<PlaceOrder />} />
            </Routes>
          </div>
          <Footer />
        </>
      ) : (
        // Giao diện Admin
        <div className="admin">
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<ProductApp />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
