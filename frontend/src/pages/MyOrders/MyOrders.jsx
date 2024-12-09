import React, { useContext, useEffect, useState } from 'react';
import styles from './MyOrders.module.css';
import { assets } from '../../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import jwtDecode from 'jwt-decode';
import { StoreContext } from '../../context/StoreContext';
import Modal from './Modal';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");  // State to hold the selected status
    const [errorMessage, setErrorMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const { formatPrice } = useContext(StoreContext);
    const token = localStorage.getItem("authToken");
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const orderPerPage = 2;

    // Define the possible statuses here
    const allStatuses = ["All", "Pending", "Shipped", "Delivered", "Cancelled","Confirmed"];

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setCurrentPage(1); // Reset page to 1 when status changes
    };

    const createHeaders = () => {
        console.log("Token from localStorage:", token);
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {

        if (!token) {
            setErrorMessage("Please log in to view your orders.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setErrorMessage(null);

            try {
                const response = await axiosInstance.get('/order/', {
                    headers: createHeaders(),
                    params: {
                        status: status === "All" ? "" : status,  // If status is "All", don't filter by status
                        page: currentPage,
                        limit: orderPerPage,
                    },
                });

                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setErrorMessage("Sorry, you have no orders.");
                } else {
                    setErrorMessage("Failed to load orders. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [status, currentPage, token]);

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await axiosInstance.put(`order/delete/${orderId}`, { headers: createHeaders() });

            if (response.status === 200) {
                setTimeout(() => {
                    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                    console.log("Order canceled successfully:", orderId);
                    window.location.reload();
                }, 3000);
            } else {
                console.error("Failed to delete the order");
                setErrorMessage("Failed to delete the order. Please try again.");
            }
        } catch (error) {
            if (error.response.status === 400) {
                setErrorMessage("You can't cancel while the order is delivering!");
            } else if (error.response.status === 403) {
                setErrorMessage("You don't have permission to cancel this order.");
            } else {
                setErrorMessage("An error occurred while canceling the order.");
            }

        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const handleViewDetails = (order) => {
        setOrderDetails(order);
        setIsDetailsModalOpen(true);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <div className={styles.statusFilter}>
                <label htmlFor="status">Filter by Status: </label>
                <select
                    id="status"
                    value={status}
                    onChange={handleStatusChange}
                    className={styles.selectStatus}
                >
                    {allStatuses.map((statusItem) => (
                        <option key={statusItem} value={statusItem}>
                            {statusItem}
                        </option>
                    ))}
                </select>
            </div>

            {isDetailsModalOpen && orderDetails && (
                <Modal
                    onClose={() => setIsDetailsModalOpen(false)}
                    order={orderDetails}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToNextPage={goToNextPage}
                    goToPrevPage={goToPrevPage}
                />
            )}

            <div className={styles['my-orders']}>
                <h2>My Orders</h2>
                <div>{errorMessage}</div>
                <div className={styles.container}>
                    {orders.map((order) => (
                        <div key={order._id} className={styles["my-orders-order"]}>
                            <img src={assets.parcel_icon} alt="" />
                            <p>ID: {order._id}</p>
                            <p>{formatPrice(order.totalPrice)}</p>
                            <p>Items: {order.products.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={() => handleViewDetails(order)} className={styles.detail}>Detail</button>
                            <button onClick={() => handleDeleteOrder(order._id)}>Cancel</button>
                        </div>
                    ))}
                </div>
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
        </div>
    );
};

export default MyOrders;
