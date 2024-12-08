import React, { useContext, useEffect, useState } from 'react'
import styles from './MyOrders.module.css'
import { assets } from '../../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import jwtDecode from 'jwt-decode';
import { StoreContext } from '../../context/StoreContext';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const {formatPrice} = useContext(StoreContext);
    const token = localStorage.getItem("authToken");
    const [deletingOrderId, setDeletingOrderId] = useState(null);

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
            
            const response = await axiosInstance.get('/order/', { headers: createHeaders() });
            setOrders(response.data);
            setDeletingOrderId(orders._id);
          } catch (err) {
            if(error.response.status === 404){
                setErrorMessage("Sorry you have no order");
            } else{
                setErrorMessage("Failed to load orders. Please try again later.");
            }
          } finally {
            setLoading(false);
          }
        };
      
        fetchOrders();
      }, []);

      const handleDeleteOrder = async (orderId) => {
        try {
          const response = await axiosInstance.put(`order/delete/${orderId}`,{ headers: createHeaders() });
    
          if (response.status === 200) {
            setTimeout(() => {
              setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
              console.log("Order deleted successfully:", orderId);
            }, 3000);
          } else {
            console.error("Failed to delete the order");
            setErrorMessage("Failed to delete the order. Please try again.");
          }
        } catch (error) {
          if(error.response.status === 400){
            setErrorMessage("You can't cancel while the order is delivery!");
          } else if(error.response.status === 403){
            setErrorMessage("You don't have permission to cancel this order.");
          } else {
            setErrorMessage("An error occurred while deleting the order.");
          }
          
        }
      };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
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
                <button className={styles.detail}>Detail</button>
                <button onClick={() => handleDeleteOrder(order._id)}>Cancel</button>
            </div>
            ))}
                
            </div>
        </div>
  )
}

export default MyOrders
