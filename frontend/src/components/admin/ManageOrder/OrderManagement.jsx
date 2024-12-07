import React, { useState, useEffect } from "react";
import styles from "./OrderManagement.module.css";
import Modal from "./Modal.jsx"; // Reuse or create a new Modal for details

// Mock API for fetching orders
const fetchOrders = () => {
  return Promise.resolve([
    { id: 1, customerName: "John Doe", product: "Laptop", quantity: 1, total: 1000, status: "Pending" },
    { id: 2, customerName: "Jane Smith", product: "Smartphone", quantity: 2, total: 1200, status: "Shipped" },
    { id: 3, customerName: "Sam Green", product: "Headphones", quantity: 3, total: 300, status: "Delivered" },
    { id: 4, customerName: "Amy White", product: "TV", quantity: 1, total: 600, status: "Pending" },
    { id: 5, customerName: "Chris Black", product: "Tablet", quantity: 2, total: 800, status: "Shipped" },
    { id: 6, customerName: "Diana Blue", product: "Smartwatch", quantity: 1, total: 250, status: "Delivered" },
  ]);
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    product: "",
    quantity: 1,
    total: 0,
    status: "Pending",
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // New state for details modal
  const [orderDetails, setOrderDetails] = useState(null); // State to hold the details of the order

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    loadOrders();
  }, []);

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({ ...order });
    setIsModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (!newOrder.customerName.trim() || !newOrder.product.trim() || newOrder.total <= 0) {
      alert("All fields must be filled correctly");
      return;
    }
    const updatedOrder = { ...newOrder, id: editingOrder.id };
    setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
    setEditingOrder(null);
    setNewOrder({ customerName: "", product: "", quantity: 1, total: 0, status: "Pending" });
    setIsModalOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleViewDetails = (order) => {
    setOrderDetails(order);
    setIsDetailsModalOpen(true); // Open the details modal
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Order Management</h1>

      {/* Modal for adding/editing order */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOrder}
          order={newOrder}
          setOrder={setNewOrder}
          isEditing={editingOrder !== null}
        />
      )}

      {/* Modal for showing order details */}
      {isDetailsModalOpen && orderDetails && (
        <Modal
          onClose={() => setIsDetailsModalOpen(false)}
          order={orderDetails}
          isDetails={true} // Indicate that this modal is for showing details
        />
      )}

      {/* Table to display orders */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>{order.total} VND</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleEditOrder(order)} className={styles.buttonEdit}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className={styles.buttonDelete}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className={styles.buttonDetails}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
