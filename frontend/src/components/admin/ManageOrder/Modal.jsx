import React from 'react';
import styles from './Modal.module.css';  // Import file CSS module

const Modal = ({ onClose, onSave, order, setOrder, isEditing, isDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  // Render different modal content based on the modal type (edit, add, details)
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        
        {/* Modal Title */}
        <h2 className={styles.modalTitle}>
          {isDetails ? 'Order Details' : isEditing ? 'Edit Order' : 'Add Order'}
        </h2>

        {/* Order details view */}
        {isDetails ? (
          <div className={styles.detailsContainer}>
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Product:</strong> {order.product}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total:</strong> {order.total} VND</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button onClick={onClose} className={styles.modalButton}>
              Close
            </button>
          </div>
        ) : (
          <div>
            {/* Editable fields for add or edit */}
            <label className={styles.modalLabel}>
              Customer Name:
              <input
                className={styles.modalInput}
                type="text"
                name="customerName"
                value={order.customerName}
                onChange={handleChange}
                required
                disabled={isDetails}
              />
            </label>

            <label className={styles.modalLabel}>
              Product:
              <input
                className={styles.modalInput}
                type="text"
                name="product"
                value={order.product}
                onChange={handleChange}
                required
                disabled={isDetails}
              />
            </label>

            <label className={styles.modalLabel}>
              Quantity:
              <input
                className={styles.modalInput}
                type="number"
                name="quantity"
                value={order.quantity}
                onChange={handleChange}
                required
                min="1"
                disabled={isDetails}
              />
            </label>

            <label className={styles.modalLabel}>
              Total:
              <input
                className={styles.modalInput}
                type="number"
                name="total"
                value={order.total}
                onChange={handleChange}
                required
                min="1"
                disabled={isDetails}
              />
            </label>

            <label className={styles.modalLabel}>
              Status:
              <select
                className={styles.modalSelect}
                name="status"
                value={order.status}
                onChange={handleChange}
                required
                disabled={isDetails}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>

            {/* Buttons for add/edit actions */}
            {!isDetails && (
              <button onClick={onSave} className={styles.modalButton}>
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
