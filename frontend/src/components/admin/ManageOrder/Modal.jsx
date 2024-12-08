import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, onSave, order, setOrder, isEditing, isDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };
  ///aaaaa
  // Ensure order status, email, and phone have a default value if they are undefined
  const safeOrder = {
    ...order,
    status: order.status || "Pending",  // Default to "Pending" if status is undefined
    email: order.email || "",           // Default to empty string if email is undefined
    phone: order.phone || "",           // Default to empty string if phone is undefined
  };

  const handleSaveChanges = () => {
    if (isEditing) {
      // Ensure onSave is properly passed down and contains the correct parameters
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
              <>
                <label className={styles.modalLabel}>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={safeOrder.email}  // Use safeOrder for controlled value
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.modalLabel}>
                  Phone:
                  <input
                    type="tel"
                    name="phone"
                    value={safeOrder.phone}  // Use safeOrder for controlled value
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
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
