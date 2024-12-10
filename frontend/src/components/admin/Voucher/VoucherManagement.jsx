import React, { useState, useEffect } from "react";
import styles from "./VoucherManagement.module.css";
import axiosInstance from "../../../utils/axiosConfig"; 

// Giả lập lấy danh sách voucher từ server
const fetchVouchers = async () => {
  try {
    const response = await axiosInstance.get("/voucher"); // Giả sử API trả về danh sách voucher
    return response.data.vouchers; // Giả sử API trả về thuộc tính "vouchers"
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return []; // Trả về danh sách rỗng nếu có lỗi
  }
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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load danh sách voucher từ backend khi component load
  useEffect(() => {
    const loadVouchers = async () => {
      const fetchedVouchers = await fetchVouchers();
      setVouchers(fetchedVouchers);
      setLoading(false);
    };
    loadVouchers();
  }, []);

  const indexOfLastVoucher = currentPage * itemsPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - itemsPerPage;
  const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Thêm voucher mới vào hệ thống
  const handleAddVoucher = async () => {
    try {
      const response = await axiosInstance.post("/voucher/add", {
        code: newVoucher.code,
        discountType: newVoucher.discountType,
        discountValue: newVoucher.discountValue,
        minOrderValue: newVoucher.minOrderValue,
        expiryDate: newVoucher.expiryDate,
        usageLimit: newVoucher.usageLimit,
      });

      if (response.status === 201) {
        const createdVoucher = response.data.voucher;
        setVouchers((prevVouchers) => [
          ...prevVouchers,
          { ...createdVoucher, id: createdVoucher._id, expiryDate: new Date(createdVoucher.expiryDate).toISOString() },
        ]);
        setNewVoucher({
          code: "",
          discountType: "percentage",
          discountValue: 0,
          minOrderValue: 0,
          expiryDate: "",
          usageLimit: 1,
        });
      }
    } catch (error) {
      console.error("Error adding voucher:", error);
    }
  };

  // Xóa voucher
  const handleDeleteVoucher = async (id) => {
    try {
        // Gửi yêu cầu DELETE với id
        await axiosInstance.delete(`/voucher/${id}`);
        
        // Cập nhật lại state sau khi xóa thành công
        setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher._id !== id));
    } catch (error) {
        console.error("Error deleting voucher:", error);
    }
};


  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Voucher Management</h1>

      {/* Form thêm voucher */}
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
          <button type="button" onClick={handleAddVoucher}>
            Add Voucher
          </button>
        </form>
      </div>

      {/* Hiển thị danh sách voucher */}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher) => (
              <tr key={voucher._id}>
                <td>{voucher._id}</td>
                <td>{voucher.code}</td>
                <td>{voucher.discountType}</td>
                <td>{voucher.discountType === "percentage" ? `${voucher.discountValue}%` : `$${voucher.discountValue}`}</td>
                <td>{voucher.minOrderValue}</td>
                <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td>
                <td>{voucher.usageLimit}</td>
                <td>
                  <button onClick={() => handleDeleteVoucher(voucher._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
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
