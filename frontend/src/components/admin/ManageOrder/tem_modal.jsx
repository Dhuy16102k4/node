import React, { useState } from "react";
import styles from "./Modal.module.css";

const Modal = ({ onClose, order, isDetails, onSave, setOrder }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Pagination for products in both "Edit" and "View Details" modes
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = order.products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Paginate function
  const paginate = (pageNumber) => {
    console.log(`Changing page to: ${pageNumber}`); // Debugging page change
    setCurrentPage(pageNumber);
  };

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
                {currentProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstProduct + index + 1}</td>
                    <td>{product.name}</td>
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
                    className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

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
                {currentProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstProduct + index + 1}</td>
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

            {/* Pagination for products */}
            {order.products.length > itemsPerPage && (
              <div className={styles.pagination}>
                {Array.from({ length: Math.ceil(order.products.length / itemsPerPage) }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

            <button onClick={onSave} className={styles.modalButton}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
