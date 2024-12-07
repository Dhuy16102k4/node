import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ onClose, order, isDetails, onSave, setOrder }) => {
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

        {/* Modal Title */}
        <h2 className={styles.modalTitle}>
          {isDetails ? "Order Details" : "Edit Order"}
        </h2>

        {isDetails ? (
          <div className={styles.detailsContainer}>
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Total:</strong> {order.total} VND</p>
            <p><strong>Status:</strong> {order.status}</p>

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
                {order.products && order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={onClose} className={styles.modalButton}>Close</button>
          </div>
        ) : (
          <div>
            {/* Editable fields */}
            <label className={styles.modalLabel}>
              Customer Name:
              <input
                className={styles.modalInput}
                type="text"
                name="customerName"
                value={order.customerName}
                onChange={handleChange}
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
              />
            </label>

            <label className={styles.modalLabel}>
              Status:
              <select
                className={styles.modalSelect}
                name="status"
                value={order.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>

            <h3 className={styles.productsTitle}>Edit Products:</h3>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.products && order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        className={styles.modalInput}
                        type="text"
                        name={`productName${index}`}
                        value={product.name}
                        onChange={(e) => {
                          const updatedProducts = [...order.products];
                          updatedProducts[index].name = e.target.value;
                          setOrder((prevOrder) => ({
                            ...prevOrder,
                            products: updatedProducts,
                          }));
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.modalInput}
                        type="number"
                        name={`quantity${index}`}
                        value={product.quantity}
                        onChange={(e) => {
                          const updatedProducts = [...order.products];
                          updatedProducts[index].quantity = parseInt(e.target.value, 10);
                          setOrder((prevOrder) => ({
                            ...prevOrder,
                            products: updatedProducts,
                          }));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={onSave} className={styles.modalButton}>Save</button>
            <button onClick={onClose} className={styles.modalButton}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
