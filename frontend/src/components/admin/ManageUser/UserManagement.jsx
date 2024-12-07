import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";

// Mock API for fetching users (replace with actual API call if available)
const fetchUsers = () => {
  return Promise.resolve([
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", purchases: 5 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210", purchases: 3 },
    { id: 3, name: "Sam Green", email: "sam.green@example.com", phone: "456-789-1234", purchases: 10 },
    { id: 4, name: "Amy White", email: "amy.white@example.com", phone: "321-654-9870", purchases: 7 },
    { id: 5, name: "Chris Black", email: "chris.black@example.com", phone: "789-123-4567", purchases: 2 },
    { id: 6, name: "Diana Blue", email: "diana.blue@example.com", phone: "111-222-3333", purchases: 6 },
    { id: 7, name: "Tom Brown", email: "tom.brown@example.com", phone: "444-555-6666", purchases: 4 },
    { id: 8, name: "Alice Green", email: "alice.green@example.com", phone: "777-888-9999", purchases: 9 },
    { id: 9, name: "Bob Gray", email: "bob.gray@example.com", phone: "999-888-7777", purchases: 1 },
    { id: 10, name: "Nancy Black", email: "nancy.black@example.com", phone: "555-444-3333", purchases: 5 },
    { id: 11, name: "Zack White", email: "zack.white@example.com", phone: "222-333-4444", purchases: 8 },
    { id: 12, name: "Eva Green", email: "eva.green@example.com", phone: "333-222-1111", purchases: 3 },
  ]);
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of users per page

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);

  // Get current users for the page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle pagination
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Purchases</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, index) => (
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
