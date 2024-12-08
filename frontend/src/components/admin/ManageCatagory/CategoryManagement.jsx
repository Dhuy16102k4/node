import React, { useState, useEffect } from "react";
import styles from "./CategoryManagement.module.css";
import Modal from "./modal.jsx"; // Import the Modal component
import axiosInstance from "../../../utils/axiosConfig"; // Import axiosInstance

// Fetch categories from API with pagination
const fetchCategories = async (page, limit) => {
  try {
    const response = await axiosInstance.get(`/category?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], currentPage: 1, totalPages: 1 };
  }
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on page load and whenever the page number changes
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true); // Start loading before fetching categories
      const fetchedData = await fetchCategories(currentPage, itemsPerPage);
      setCategories(fetchedData.categories); // Set the fetched categories
      setCurrentPage(fetchedData.currentPage); // Update the current page
      setTotalPages(fetchedData.totalPages); // Update the total pages
      setLoading(false); // Stop loading once the categories are fetched
    };
    loadCategories();
  }, [currentPage]); // Re-fetch when the currentPage changes

  // Handle adding a category
  const handleAddCategory = async () => {
    if (!categoryData.name.trim() || !categoryData.description.trim()) {
      alert("Both category name and description are required");
      return;
    }

    try {
      const response = await axiosInstance.post("/category", categoryData);
      setCategories((prevCategories) => [
        ...prevCategories,
        response.data.category,
      ]);
      setCategoryData({ name: "", description: "" });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Handle editing a category
  const handleEditCategory = async () => {
    if (!categoryData.name.trim() || !categoryData.description.trim()) {
      alert("Both category name and description are required");
      return;
    }

    try {
      const response = await axiosInstance.put(`/category/${editingCategory._id}`, categoryData);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === editingCategory._id ? response.data.category : category
        )
      );
      setEditingCategory(null);
      setCategoryData({ name: "", description: "" });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete(`/category/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Handle modal cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
    setCategoryData({ name: "", description: "" });
    setEditingCategory(null);
  };

  // Handle input changes in the modal
  const handleInputChange = (field, value) => {
    setCategoryData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Category Management</h1>

      {/* Button to add category */}
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
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        categoryData={categoryData}
        onInputChange={handleInputChange}
        isEditing={!!editingCategory}
      />

      {/* Table displaying categories */}
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
            {categories.map((category) => (
              <tr key={category._id}>
                <td className={styles.td}>{category.name}</td>
                <td className={styles.td}>{category.description}</td>
                <td className={styles.td}>
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryData({ name: category.name, description: category.description });
                      setIsModalVisible(true);
                    }}
                    className={styles.buttonEdit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
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

      {/* Pagination */}
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

export default CategoryManagement;
