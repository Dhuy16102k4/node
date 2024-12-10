import React, { useState, useEffect } from "react";
import "./HomeAdmin.css";
import axiosInstance from "../../../utils/axiosConfig";

const HomeAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    topUsers: [],
    topSellingProducts: [],
    latestOrders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <section className="home">
      <div className="container">
        {/* Dashboard Heading */}
        <div className="heading flexSB">
          <h3>Admin Dashboard</h3>
          <span><a href="/">Home </a> / Dashboard</span>
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
        <div className="details-grid">
          <div className="card">
            <h4>Top Purchasing Users</h4>
            <div className="table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Top Selling Products</h4>
            <div className="table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topSellingProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName}</td>
                      <td>{product.totalQuantity}</td>
                      <td>${product.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>New Orders</h4>
            <div className="table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.latestOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.user?.username || "Unknown"}</td>
                      <td>${order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAdmin;