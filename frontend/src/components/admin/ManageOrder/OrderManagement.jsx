import React, { useState, useEffect } from "react";
import styles from "./OrderManagement.module.css";
import Modal from "./Modal.jsx";

// Mock API for fetching orders
const fetchOrders = () => {
  return Promise.resolve([
    {
      id: 1,
      customerName: "John Doe",
      products: [
        { name: "Laptop", quantity: 1 },
        { name: "Mouse", quantity: 2 },
      ],
      total: 1000,
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      products: [
        { name: "Smartphone", quantity: 2 },
        { name: "Headphones", quantity: 1 },
      ],
      total: 1200,
      status: "Shipped",
    },
    {
      id: 3,
      customerName: "Sam Green",
      products: [
        { name: "Headphones", quantity: 3 },
        { name: "Charger", quantity: 2 },
      ],
      total: 300,
      status: "Delivered",
    },
  ]);
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // For details modal
  const [orderDetails, setOrderDetails] = useState(null); // State for selected order details
  const [editingOrder, setEditingOrder] = useState(null); // State for editing order

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

  const handleViewDetails = (order) => {
    setOrderDetails(order);
    setIsDetailsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOrderDetails({ ...order }); // Pass editable order data to the modal
    setIsModalOpen(true);
  };

  const handleSaveOrder = () => {
    setOrders(orders.map(order => order.id === editingOrder.id ? orderDetails : order));
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
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

      {/* Modal for showing order details */}
      {isDetailsModalOpen && orderDetails && (
        <Modal
          onClose={() => setIsDetailsModalOpen(false)}
          order={orderDetails}
          isDetails={true} // Details mode
        />
      )}

      {/* Modal for editing order */}
      {isModalOpen && orderDetails && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          order={orderDetails}
          isDetails={false} // Editing mode
          onSave={handleSaveOrder}
          setOrder={setOrderDetails}
        />
      )}

      {/* Table to display orders */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerName}</td>
                <td>{order.total} VND</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() => handleEditOrder(order)}
                    className={styles.buttonEdit}
                  >
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
                    View Details
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
