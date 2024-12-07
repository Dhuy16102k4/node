import React, { useState, useEffect } from "react";
import styles from "./CategoryManagement.module.css";
import Modal from "./modal.jsx"; // Import the Modal component

// Mock API calls
const fetchCategories = () => {
  return Promise.resolve([
    { id: 1, name: "Electronics", description: "Devices and gadgets" },
    { id: 2, name: "Clothing", description: "Fashion and apparel" },
    { id: 3, name: "Books", description: "Printed and digital books" },
    { id: 4, name: "Home Appliances", description: "Kitchen and home gadgets" },
    { id: 5, name: "Sports", description: "Sports equipment and gear" },
    { id: 6, name: "Music", description: "Musical instruments and accessories" },
    { id: 7, name: "Beauty", description: "Cosmetics and skincare" },
    { id: 8, name: "Toys", description: "Toys and games for kids" },
    { id: 9, name: "Food", description: "Groceries and food items" },
    { id: 10, name: "Books", description: "Printed and digital books" },
  ]);
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const handleAddCategory = () => {
    if (!categoryData.name.trim() || !categoryData.description.trim()) {
      alert("Both category name and description are required");
      return;
    }
    const addedCategory = { id: Date.now(), ...categoryData };
    setCategories([...categories, addedCategory]);
    setCategoryData({ name: "", description: "" });
    setIsModalVisible(false); // Hide modal after adding
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryData({ name: category.name, description: category.description });
    setIsModalVisible(true); // Show modal when editing
  };

  const handleSaveCategory = () => {
    if (!categoryData.name.trim() || !categoryData.description.trim()) {
      alert("Both category name and description are required");
      return;
    }
    const updatedCategory = { ...categoryData, id: editingCategory.id };
    setCategories(categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    ));
    setEditingCategory(null);
    setCategoryData({ name: "", description: "" });
    setIsModalVisible(false); // Hide modal after saving
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide the modal when canceled
    setCategoryData({ name: "", description: "" }); // Clear form fields
    setEditingCategory(null); // Clear any editing state
  };

  const handleInputChange = (field, value) => {
    setCategoryData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Lấy danh sách các category cho trang hiện tại
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Chuyển sang trang kế tiếp
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Category Management</h1>

      {/* Nút thêm category */}
      <button 
        onClick={() => setIsModalVisible(true)} 
        className={styles.buttonAdd}
      >
        Add Category
      </button>

      {/* Modal for Add or Edit */}
      <Modal
        isVisible={isModalVisible}
        onClose={handleCancel}
        onSave={editingCategory ? handleSaveCategory : handleAddCategory}
        categoryData={categoryData}
        onInputChange={handleInputChange}
        isEditing={!!editingCategory}
      />

      {/* Bảng hiển thị danh sách category */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Category Name</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id}>
                <td className={styles.td}>{category.name}</td>
                <td className={styles.td}>{category.description}</td>
                <td className={styles.td}>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className={styles.buttonEdit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className={styles.buttonDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, index) => (
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

export default CategoryManagement;
