import React from "react";
import "./HomeAdmin.css";

const HomeAdmin = () => {
  const dashboardData = {
    totalRevenue: 5000000,
    totalUsers: 250,
    totalOrders: 1200,
    totalProducts: [
      { name: "Product X", quantity: 150 },
      { name: "Product Y", quantity: 200 },
      { name: "Product Z", quantity: 180 },
    ],
    topUsers: [
      { name: "User A", totalOrders: 50 },
      { name: "User B", totalOrders: 35 },
      { name: "User C", totalOrders: 25 },
    ],
    topProducts: [
      { name: "Product X", soldCount: 100 },
      { name: "Product Y", soldCount: 80 },
      { name: "Product Z", soldCount: 70 },
    ],
    latestOrders: [
      { orderId: "ORD123", user: "User A", status: "Delivered" },
      { orderId: "ORD124", user: "User B", status: "Processing" },
      { orderId: "ORD125", user: "User C", status: "Shipped" },
    ],
  };

  // Calculate the total number of all products
  const totalProductQuantity = dashboardData.totalProducts.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

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
          <div className="overview-card">
            <h4>Total Products</h4>
            <p>{totalProductQuantity}</p>
            <span className="icon products-icon">📊</span>
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

          {/* Total Products */}
          <div className="card">
            <h4>Total Products Inventory</h4>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.totalProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAdmin;
