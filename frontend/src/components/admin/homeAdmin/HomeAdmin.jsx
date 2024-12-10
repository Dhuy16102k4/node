import React, { useState, useEffect } from "react";
import "./HomeAdmin.css";
import axiosInstance from "../../../utils/axiosConfig"; // Ensure axiosConfig is set correctly

const HomeAdmin = () => {
  // State to store data from API
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: [],  // Empty array for products
    topUsers: [],      // Updated to null for a single object
    topSellingProducts: [],    // Corrected to match the response
    latestOrders: [],   // Empty array for latest orders
  });

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin"); // Adjust URL to your API
        setDashboardData(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData(); // Call the function to fetch data
  }, []); // Call only once when component is mounted

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
                  {user.username} - <strong>{user.totalOrders}</strong> Orders
                </li>
              ))}
            </ul>
          </div>

          {/* Top Selling Products */}
          <div className="card">
            <h4>Top Selling Products</h4>
            <ul>
              {Array.isArray(dashboardData.topSellingProducts) && dashboardData.topSellingProducts.length > 0 ? (
                dashboardData.topSellingProducts.map((product, index) => (
                  <li key={index}>
                    {product.productName} - <strong>{product.totalQuantity}</strong> Sold - ${product.price.toLocaleString()}
                  </li>
                ))
              ) : (
                <li>No products found</li>
              )}
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
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(dashboardData.latestOrders) && dashboardData.latestOrders.length > 0 ? (
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
