import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./HomeAdmin.css";
import axiosInstance from "../../../utils/axiosConfig";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    topUsers: [],
    topSellingProducts: [],
    latestOrders: [],
  });

  // Dữ liệu giả lập cho biểu đồ
  const mockMonthlyData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    revenue: [12000, 15000, 17000, 14000, 18000, 21000, 25000, 23000, 19000, 22000, 24000, 26000],
    profit: [4000, 5000, 6000, 4500, 7000, 9000, 11000, 10000, 8500, 9500, 10500, 12000],
    orders: [300, 400, 500, 350, 450, 600, 700, 650, 550, 600, 650, 700],
  };

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

  // Cấu hình dữ liệu biểu đồ
  const chartData = {
    labels: mockMonthlyData.months,
    datasets: [
      {
        label: "Revenue ($)",
        data: mockMonthlyData.revenue,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Profit ($)",
        data: mockMonthlyData.profit,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Orders (Count)",
        data: mockMonthlyData.orders,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue, Profit, and Orders Over the Last 12 Months",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

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

        {/* Tables and Details */}
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

        {/* Chart Section */}
        <div className="chart-section">
          <h4>Monthly Overview</h4>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </section>
  );
};

export default HomeAdmin;
