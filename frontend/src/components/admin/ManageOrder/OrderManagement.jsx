import React, { useState, useEffect } from "react";
import styles from "./OrderManagement.module.css";
import Modal from "./Modal.jsx";
import axiosInstance from "../../../utils/axiosConfig";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [allStatuses] = useState(["Pending", "Shipped", "Delivered", "Cancelled"]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);

  const [deletingOrderId, setDeletingOrderId] = useState(null); // Track which order is being deleted

  const orderPerPage = 3; // Update to match with the API limit in the response

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1); // Reset page to 1 on status change
  };

  useEffect(() => {
    console.log("Current Page in useEffect:", currentPage);

    const fetchOrders = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await axiosInstance.get("/order/admin", {
          params: {
            status: status === "All" ? "" : status,  // Ensure correct status
            page: currentPage,  // Use currentPage from state
            limit: orderPerPage,
          },
        });

        console.log("Fetched Orders:", response.data.orders);

        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setErrorMessage("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Fetch data when currentPage or status changes
  }, [status, currentPage]);

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({ ...order });
    setIsModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (!newOrder.status) {
      alert("Please select a status");
      return;
    }

    const updatedOrder = { ...newOrder, id: editingOrder._id };

    handleUpdateOrderStatus(
      editingOrder._id,
      newOrder.status,
      newOrder.email,
      newOrder.phone
    );

    setOrders(orders.map((order) =>
      order._id === updatedOrder._id ? updatedOrder : order
    ));

    setEditingOrder(null);
    setIsModalOpen(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, email, phone) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      const response = await axiosInstance.put(`order/${orderId}`, {
        status: newStatus,
        email: email,
        phone: phone,
      });

      if (response.status === 200) {
        setErrorMessage(""); 
      } else {
        setErrorMessage("Failed to update order status");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: order.status } : order
          )
        );
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating the order status");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: order.status } : order
        )
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setDeletingOrderId(orderId); // Set the deleting order to show "Waiting..."

    try {
      const response = await axiosInstance.delete(`/order/${orderId}`);

      if (response.status === 200) {
        // Simulate a 3-second delay before removing the order from the state
        setTimeout(() => {
          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
          setDeletingOrderId(null); // Reset deleting status
          console.log("Order deleted successfully:", orderId);
        }, 3000); // Wait for 3 seconds
      } else {
        console.error("Failed to delete the order");
        setErrorMessage("Failed to delete the order. Please try again.");
        setDeletingOrderId(null); // Reset deleting status
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setErrorMessage("An error occurred while deleting the order.");
      setDeletingOrderId(null); // Reset deleting status
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewDetails = (order) => {
    setOrderDetails(order);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Order Management</h1>

      <div className={styles.statusFilter}>
        <label htmlFor="status">Filter by Status: </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className={styles.selectStatus}
        >
          <option value="">All</option>
          {allStatuses.map((statusItem) => (
            <option key={statusItem} value={statusItem}>
              {statusItem}
            </option>
          ))}
        </select>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOrder}
          order={newOrder}
          setOrder={setNewOrder}
          isEditing={editingOrder !== null}
          showStatusField={true}
        />
      )}

      {isDetailsModalOpen && orderDetails && (
        <Modal
          onClose={() => setIsDetailsModalOpen(false)}
          order={orderDetails}
          isDetails={true}
        />
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Order Id</th>
              <th>Address</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user.username}</td>
                <td>{order._id}</td>
                <td>{order.address}</td>
                <td>{order.totalPrice.toLocaleString('vi-VN')} VND</td>
                <td>{order.status}</td>
                <td>
                  
                  <button
                    onClick={() => handleEditOrder(order)}
                    className={styles.buttonEdit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className={styles.buttonDelete}
                    disabled={deletingOrderId === order._id} // Disable the button if deleting
                  >
                    {deletingOrderId === order._id ? "Waiting..." : "Delete"}
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

      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>

        <span className={styles.pageNumber}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className={styles.button}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
};

export default OrderManagement;
