import React from "react";
import './HomeAdmin.css';

const HomeAdmin = () => {
  // Sample data (You will replace it with real data)
  const topUsers = [
    { name: "User A", totalOrders: 50 },
    { name: "User B", totalOrders: 35 },
    { name: "User C", totalOrders: 25 },
  ];
  
  const topProducts = [
    { name: "Product X", soldCount: 100 },
    { name: "Product Y", soldCount: 80 },
    { name: "Product Z", soldCount: 70 },
  ];
  
  const categories = ["Electronics", "Furniture", "Clothing", "Books", "Toys"];
  
  const latestOrders = [
    { orderId: "ORD123", user: "User A", status: "Delivered" },
    { orderId: "ORD124", user: "User B", status: "Processing" },
    { orderId: "ORD125", user: "User C", status: "Shipped" },
  ];

  return (
    <>
      <section className="home">
        <div className="container">
          <div className="heading flexSB">
            <h3>DashBoard</h3>
            <span>Admin / DashBoard</span>
          </div>

          <div className="dashboard-grid">
            {/* Most Purchases by Users */}
            <div className="card">
              <h4>Most Purchases by Users</h4>
              <ul>
                {topUsers.map((user, index) => (
                  <li key={index}>{user.name} - {user.totalOrders} Orders</li>
                ))}
              </ul>
            </div>

            {/* Top Selling Products */}
            <div className="card">
              <h4>Top Selling Products</h4>
              <ul>
                {topProducts.map((product, index) => (
                  <li key={index}>{product.name} - {product.soldCount} Sold</li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="card">
              <h4>Categories</h4>
              <ul>
                {categories.map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            </div>

            {/* Latest Orders */}
            <div className="card">
              <h4>Latest Orders</h4>
              <ul>
                {latestOrders.map((order, index) => (
                  <li key={index}>{order.orderId} - {order.user} - {order.status}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeAdmin;
