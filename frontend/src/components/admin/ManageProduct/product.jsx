import React, { useState, useEffect } from 'react';
import ProductList from './ProductList.jsx';
import ProductForm from './ProductForm.jsx';
import Modal from './modal.jsx';
import styles from './Product.module.css';

import axiosInstance from '../../../utils/axiosConfig'; // Axios instance for API calls
import Pagination from '../../Pagination/Pagination';

const Product = () => {
  const [products, setProducts] = useState([]); // List of products
  const [categories, setCategories] = useState([]); // List of categories
  const [editingProduct, setEditingProduct] = useState(null); // Product being edited
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for filtering
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // Modal state for adding
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false); // Modal state for editing
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [id, setId] = useState(null);
  const productsPerPage = 5; // Products per page

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/admin/product/', {
          params: {
            category: selectedCategory === 'All' ? '' : selectedCategory, // Filter based on selected category
            page: currentPage,
            limit: productsPerPage,
          },
        });

        setProducts(response.data.products);  // Set products data
        setTotalPages(response.data.totalPages); // Set pagination

        const categoriesResponse = await axiosInstance.get('/category');
        setCategories(categoriesResponse.data.categories || []);  // Set categories data
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]); // Re-fetch when category or page changes

  // Add a new product
  const addProduct = async (formData) => {
    try {
      const response = await axiosInstance.post('/admin/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response from backend:', response);
      setProducts([...products, response.data.savedProduct]); // Update product list
      window.location.reload();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  // Update an existing product
  const updateProduct = async (formData) => {
    try {
      const response = await axiosInstance.put(`/admin/product/${formData.get('id')}`, formData);
      const updatedProduct = response.data.updatedProduct;

      // Update the local state with the updated product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      window.location.reload();
      setEditingProduct(null);
      setIsEditProductModalOpen(false);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/admin/product/${productId}`);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Modal controls
  const openAddProductModal = () => setIsAddProductModalOpen(true);
  const closeAddProductModal = () => setIsAddProductModalOpen(false);

  const openEditProductModal = (product) => {
  setEditingProduct(product);
  setId(product._id ? product._id.toString() : null);  // Ensure the id is set properly (usually it's `_id`)
  setIsEditProductModalOpen(true);
};

  
  

  const closeEditProductModal = () => {
    setEditingProduct(null);
    setIsEditProductModalOpen(false);
  };

  return (
    <div className={styles['admin-container']}>
      <h1 className={styles.header}>Product Management</h1>

      {/* Add Product Button */}
      <button className={styles.addProductButton} onClick={openAddProductModal}>
        <span className={styles.plusSign}></span> Add Product
      </button>

      {/* Add Product Modal */}
      <Modal isOpen={isAddProductModalOpen} closeModal={closeAddProductModal}>
        <ProductForm
          addProduct={addProduct}
          categories={categories} // Pass categories to the form
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditProductModalOpen} closeModal={closeEditProductModal}>
      <ProductForm
        updateProduct={updateProduct}
        editingProduct={editingProduct}
        categories={categories}
        setId={setId}  // Ensure setId is passed here
      />

      </Modal>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <ProductList
          products={products}
          editProduct={openEditProductModal}
          deleteProduct={deleteProduct}
          categories={categories} // Pass categories to filter list
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory} // Pass function to update category
        />
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>

        <span className={styles.pageNumber}>{currentPage}</span>

        <button
          className={styles.button}
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Product;




