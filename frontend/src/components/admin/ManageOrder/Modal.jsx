import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, onSave, order, setOrder, isEditing, isDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic for products (both in "Edit" and "View Details" modes)
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = order.products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination handler function
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle changes in input fields (e.g., status)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  // Ensure the order has default values if some properties are undefined
  const safeOrder = {
    ...order,
    status: order.status || 'Pending', // Default to "Pending" if status is undefined
    email: order.email || '',           // Default to empty string if email is undefined
    phone: order.phone || '',           // Default to empty string if phone is undefined
  };

  // Handle saving the changes for the order (for editing)
  const handleSaveChanges = () => {
    if (isEditing) {
      onSave(safeOrder._id, safeOrder.status, safeOrder.email, safeOrder.phone);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>

        {/* Modal Title */}
        <h2 className={styles.modalTitle}>
          {isDetails ? 'Order Details' : isEditing ? 'Edit Order Status' : 'Add Order'}
        </h2>

        {/* Order details view */}
        {isDetails ? (
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
                      <td>{product.product ? product.product.name : 'Unknown Product'}</td>  {/* Đảm bảo có kiểm tra nếu product là null */}
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
        ) : (
          <div>
            {/* Editable status field for add or edit */}
            <label className={styles.modalLabel}>
              Status:
              <select
                className={styles.modalSelect}
                name="status"
                value={safeOrder.status}  // Use safeOrder for controlled value
                onChange={handleChange}
                required
                disabled={isDetails}  // Disable the field if it's in details mode
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </label>

            {/* Email and phone fields (for add/edit actions) */}
            {!isDetails && (
              <div className={styles.emailPhoneContainer}>
                <label className={styles.modalLabel}>
                  Email:
                  <input
                    type="text" // Chỉ để xem, không cho chỉnh sửa
                    value={safeOrder.email}  // Use safeOrder for controlled value
                    readOnly
                    className={styles.modalInput}  // Add class to input
                  />
                </label>

                <label className={styles.modalLabel}>
                  Phone:
                  <input
                    type="text" // Chỉ để xem, không cho chỉnh sửa
                    value={safeOrder.phone}  // Use safeOrder for controlled value
                    readOnly
                    className={styles.modalInput}  // Add class to input
                  />
                </label>
              </div>
            )}

            {/* Buttons for add/edit actions */}
            {!isDetails && (
              <button onClick={handleSaveChanges} className={styles.modalButton}>
                {isEditing ? 'Save Changes' : 'Add Order'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
