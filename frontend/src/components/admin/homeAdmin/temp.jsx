import React, { useState, useEffect } from "react";
import "./HomeAdmin.css";
import axiosInstance from "../../../utils/axiosConfig"; // Đảm bảo axiosConfig được cấu hình đúng

const HomeAdmin = () => {
  // State để lưu dữ liệu từ API
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: [],  // Không còn cần thiết trong phần này
    topUsers: [],
    topProducts: [],
    latestOrders: [],  // Dữ liệu mới cho phần đơn hàng
  });

  // Fetch dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi API để lấy dữ liệu thống kê dashboard
        const response = await axiosInstance.get("/admin"); // Điều chỉnh URL theo API của bạn
        setDashboardData(response.data); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData(); // Gọi hàm fetch dữ liệu
  }, []); // Chỉ gọi khi component mount lần đầu

  return (
    <section className="home">
      <div className="container">
        {/* Dashboard Heading */}
        <div className="heading flexSB">
          <h3>Admin Dashboard</h3>
          <span>Home / Dashboard</span>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card">
            <h4>Total Revenue</h4>
            <p>${dashboardData.totalRevenue.toLocaleString()}</p>
            <span className="icon revenue-icon">💵</span>
          </div>
          <div className="overview-card">
            <h4>Total Users</h4>
            <p>{dashboardData.totalUsers}</p>
            <span className="icon users-icon">👥</span>
          </div>
          <div className="overview-card">
            <h4>Total Orders</h4>
            <p>{dashboardData.totalOrders}</p>
            <span className="icon orders-icon">📦</span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="details-grid">
          {/* Top Users */}
          <div className="card">
            <h4>Top Purchasing Users</h4>
            <ul>
              {dashboardData.topUsers.map((user, index) => (
                <li key={index}>
                  {user.name} - <strong>{user.totalOrders}</strong> Orders
                </li>
              ))}
            </ul>
          </div>

          {/* Top Products */}
          <div className="card">
            <h4>Top Selling Products</h4>
            <ul>
              {dashboardData.topProducts.map((product, index) => (
                <li key={index}>
                  {product.name} - <strong>{product.soldCount}</strong> Sold
                </li>
              ))}
            </ul>
          </div>

          {/* New Orders */}
          <div className="card">
            <h4>New Orders</h4>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Username</th>
                  <th>TotalPrice</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.latestOrders?.length > 0 ? (
                  dashboardData.latestOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order._id}</td>
                      <td>{order.user?.username}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No orders found</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAdmin;
