import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, order }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic for products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = order.products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination handler function
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Ensure the order has default values if some properties are undefined
  const safeOrder = {
    ...order,
    status: order.status || 'Pending',  // Default to "Pending" if status is undefined
    email: order.email || '',           // Default to empty string if email is undefined
    phone: order.phone || '',           // Default to empty string if phone is undefined
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>

        {/* Modal Title */}
        <h2 className={styles.modalTitle}>Order Details</h2>

        {/* Order details view */}
        <div className={styles.detailsContainer}>
          <p><strong>Status:</strong> {safeOrder.status}</p>
          <p><strong>Email:</strong> {safeOrder.email}</p>
          <p><strong>Phone:</strong> {safeOrder.phone}</p>

          {/* Product Table */}
          <h3 className={styles.productsTitle}>Products Purchased:</h3>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={index}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{product.product ? product.product.name : 'Unknown Product'}</td>  {/* Ensure product check */}
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination for products */}
          {order.products.length > itemsPerPage && (
            <div className={styles.pagination}>
              {Array.from({ length: Math.ceil(order.products.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          <button onClick={onClose} className={styles.modalButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
