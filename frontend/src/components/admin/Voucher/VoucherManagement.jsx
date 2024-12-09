import React, { useState, useEffect } from "react";
import styles from "./VoucherManagement.module.css";

// Mock API for fetching, adding, and deleting vouchers
const fetchVouchers = () => {
  return Promise.resolve([
    { id: 1, code: "VOUCHER1", discountType: "percentage", discountValue: 10, minOrderValue: 100, expiryDate: "2024-12-31", usageLimit: 5, usedCount: 2, isActive: true },
    { id: 2, code: "VOUCHER2", discountType: "fixed", discountValue: 50, minOrderValue: 200, expiryDate: "2024-12-30", usageLimit: 10, usedCount: 5, isActive: false },
    { id: 3, code: "VOUCHER3", discountType: "percentage", discountValue: 15, minOrderValue: 50, expiryDate: "2025-01-15", usageLimit: 3, usedCount: 1, isActive: true },
    { id: 4, code: "VOUCHER4", discountType: "fixed", discountValue: 30, minOrderValue: 150, expiryDate: "2024-12-25", usageLimit: 7, usedCount: 4, isActive: true },
    { id: 5, code: "VOUCHER5", discountType: "percentage", discountValue: 20, minOrderValue: 0, expiryDate: "2025-02-01", usageLimit: 2, usedCount: 0, isActive: false },
    { id: 6, code: "VOUCHER6", discountType: "fixed", discountValue: 10, minOrderValue: 80, expiryDate: "2025-03-20", usageLimit: 4, usedCount: 3, isActive: true },
    { id: 7, code: "VOUCHER7", discountType: "percentage", discountValue: 25, minOrderValue: 120, expiryDate: "2024-11-30", usageLimit: 6, usedCount: 3, isActive: true },
    { id: 8, code: "VOUCHER8", discountType: "fixed", discountValue: 100, minOrderValue: 500, expiryDate: "2024-12-10", usageLimit: 1, usedCount: 1, isActive: false },
    { id: 9, code: "VOUCHER9", discountType: "percentage", discountValue: 10, minOrderValue: 60, expiryDate: "2024-12-15", usageLimit: 5, usedCount: 0, isActive: true },
    { id: 10, code: "VOUCHER10", discountType: "fixed", discountValue: 40, minOrderValue: 100, expiryDate: "2025-03-01", usageLimit: 3, usedCount: 2, isActive: true },
    { id: 11, code: "VOUCHER11", discountType: "percentage", discountValue: 30, minOrderValue: 200, expiryDate: "2024-12-05", usageLimit: 8, usedCount: 6, isActive: false },
  ]);
};

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    expiryDate: "",
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadVouchers = async () => {
      const fetchedVouchers = await fetchVouchers();
      setVouchers(fetchedVouchers);
      setLoading(false);
    };
    loadVouchers();
  }, []);

  // Get current vouchers for the page
  const indexOfLastVoucher = currentPage * itemsPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - itemsPerPage;
  const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add new voucher
  const handleAddVoucher = () => {
    setVouchers((prevVouchers) => [
      ...prevVouchers,
      { ...newVoucher, id: prevVouchers.length + 1, expiryDate: new Date(newVoucher.expiryDate).toISOString() },
    ]);
    setNewVoucher({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderValue: 0,
      expiryDate: "",
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
    });
  };

  // Delete voucher
  const handleDeleteVoucher = (id) => {
    setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Voucher Management</h1>

      {/* Add Voucher Form */}
      <div className={styles.formContainer}>
        <h2>Add New Voucher</h2>
        <form>
          <input
            type="text"
            placeholder="Voucher Code"
            value={newVoucher.code}
            onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
            required
          />
          <select
            value={newVoucher.discountType}
            onChange={(e) => setNewVoucher({ ...newVoucher, discountType: e.target.value })}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input
            type="number"
            placeholder="Discount Value"
            value={newVoucher.discountValue}
            onChange={(e) => setNewVoucher({ ...newVoucher, discountValue: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Minimum Order Value"
            value={newVoucher.minOrderValue}
            onChange={(e) => setNewVoucher({ ...newVoucher, minOrderValue: e.target.value })}
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={newVoucher.expiryDate}
            onChange={(e) => setNewVoucher({ ...newVoucher, expiryDate: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Usage Limit"
            value={newVoucher.usageLimit}
            onChange={(e) => setNewVoucher({ ...newVoucher, usageLimit: e.target.value })}
          />
          <input
            type="number"
            placeholder="Used Count"
            value={newVoucher.usedCount}
            onChange={(e) => setNewVoucher({ ...newVoucher, usedCount: e.target.value })}
          />
          <label>
            Active
            <input
              type="checkbox"
              checked={newVoucher.isActive}
              onChange={() => setNewVoucher({ ...newVoucher, isActive: !newVoucher.isActive })}
            />
          </label>
          <button type="button" onClick={handleAddVoucher}>
            Add Voucher
          </button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Min Order Value</th>
              <th>Expiry Date</th>
              <th>Usage Limit</th>
              <th>Used Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.id}</td>
                <td>{voucher.code}</td>
                <td>{voucher.discountType}</td>
                <td>{voucher.discountType === "percentage" ? `${voucher.discountValue}%` : `$${voucher.discountValue}`}</td>
                <td>{voucher.minOrderValue}</td>
                <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td>
                <td>{voucher.usageLimit}</td>
                <td>{voucher.usedCount}</td>
                <td>{voucher.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleDeleteVoucher(voucher.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(vouchers.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoucherManagement;
