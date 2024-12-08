import React, { useContext, useEffect, useState } from 'react'
import styles from './MyOrders.module.css'
import { assets } from '../../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import jwtDecode from 'jwt-decode';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const {showAdd} = useContext(AuthContext);
    const token = localStorage.getItem("authToken");
    
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
            console.log("Fetched Orders:", response.data);
            setOrders(response.data);
          } catch (err) {
            setErrorMessage("Failed to load orders. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
      
        fetchOrders();
      }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles['my-orders']}>
            <h2>My Orders</h2>
            <div className={styles.container}>
                {/* {orders.map((order) => ( */}
                    <div key="" className={styles["my-orders-order"]}>
                        <img src={assets.parcel_icon} alt="" />
                        <p>Iphone 16 Pro Max : 2</p>
                        <p>32.000.000</p>
                        <p>Items: 1</p>
                        <p><span>&#x25cf;</span> <b>Pending</b></p>
                    <button>Cancel Order</button>
                    </div>
                {/* ))} */}
                
            </div>
            <div>{}</div>
        </div>
  )
}

export default MyOrders
