import React, { useState, useEffect } from 'react';
import styles from './Product.module.css';

const ProductList = ({ products, editProduct, deleteProduct, categories, selectedCategory, setSelectedCategory }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    // Reset the filtered list when products or selectedCategory changes
    if (selectedCategory === '') {
      setFilteredProducts(products); // Show all products
    } else {
      const filtered = products.filter(
        (product) => product.category?._id === selectedCategory // Filter by category ObjectId
      );
      setFilteredProducts(filtered); // Show filtered products
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category to ObjectId
  };

  const handleDeleteProduct = async (productId) => {
    if (products.length <= 1) {
      return; // Disable deletion if there's only one product left
    }

    try {
      await deleteProduct(productId); // Call the deleteProduct function (from parent component) to delete the product
      setFilteredProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Helper function to format numbers as VND
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  return (
    <div>
      <h2>Product List</h2>
      <div className={styles.filterContainer}>
        <label htmlFor="category" className={styles.filterLabel}>
          Filter by category:
        </label>
        <select
          id="category"
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <table className={styles['product-table']}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Description</th>
            <th colSpan="2">Action</th> {/* Cột thao tác cho Sửa và Xóa */}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            const imageUrl = product.img
              ? `${import.meta.env.VITE_API_URL}${product.img.replace(/\\/g, '/')}`
              : null;

            return (
              <tr key={product._id}>
                <td>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={styles['product-image']}
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td> {/* Format the price here */}
                <td>{product.category?.name}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className={`${styles.button} ${styles['edit-button']}`}
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className={`${styles.button} ${styles['delete-button']}`}
                    onClick={() => handleDeleteProduct(product._id)} // Use the new delete function
                    disabled={filteredProducts.length <= 1} // Disable delete button if there's only one product
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
