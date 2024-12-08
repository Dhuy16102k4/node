import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";
import axiosInstance from "../../../utils/axiosConfig";  // Nhập axiosInstance từ tệp cấu hình

// Hàm gọi API sử dụng axiosInstance
const fetchUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/user`, {
      params: { page, limit },  // Truyền tham số page và limit qua query string
    });
    return response.data; // Trả về dữ liệu từ response API
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    // Bạn có thể trả về dữ liệu mặc định hoặc ném lỗi
    return { users: [], currentPage: 1, totalPages: 1, totalUsers: 0 };
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Thông tin phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4; // Số người dùng hiển thị mỗi trang

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await fetchUsers(currentPage, itemsPerPage);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    };
    loadUsers();
  }, [currentPage]); // Chạy lại mỗi khi currentPage thay đổi

  // Điều hướng phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>User Management</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Order Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}> {/* Lưu ý sử dụng _id từ MongoDB */}
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
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

export default UserManagement;
