import React, { useState, useEffect } from 'react';
import styles from './Product.module.css'; // Import CSS module

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

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <div className={styles.filterContainer}>
        <label htmlFor="category" className={styles.filterLabel}>
          Lọc theo danh mục:
        </label>
        <select
          id="category"
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Tất cả</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}> {/* Pass ObjectId */}
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <table className={styles['product-table']}>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền</th>
            <th>Danh mục</th>
            <th>Số lượng trong kho</th>
            <th>Mô tả</th>
            <th colSpan="2">Thao tác</th> {/* Cột thao tác cho Sửa và Xóa */}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            // Construct the image URL if it exists
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
                    <span>No image available</span> // Fallback if no image
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.price} VND</td>
                <td>{product.category?.name}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className={`${styles.button} ${styles['edit-button']}`}
                    onClick={() => editProduct(product)}
                  >
                    Sửa
                  </button>
                </td>
                <td>
                  <button
                    className={`${styles.button} ${styles['delete-button']}`}
                    onClick={() => deleteProduct(product._id)}
                  >
                    Xóa
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
