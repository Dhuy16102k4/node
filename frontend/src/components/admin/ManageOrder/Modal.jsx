import React from 'react';
import styles from './Modal.module.css';  // Import file CSS module

const Modal = ({ onClose, onSave, order, setOrder, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2 className={styles.modalTitle}>
          {isEditing ? 'Edit Order' : 'Add Order'}
        </h2>
        <label className={styles.modalLabel}>
          Customer Name:
          <input
            className={styles.modalInput}
            type="text"
            name="customerName"
            value={order.customerName}
            onChange={handleChange}
            required
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
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </label>
        <button onClick={onSave} className={styles.modalButton}>
          {isEditing ? 'Save Changes' : 'Add Order'}
        </button>
      </div>
    </div>
  );
};

export default Modal;
