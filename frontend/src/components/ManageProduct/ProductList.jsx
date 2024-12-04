import React, { useState } from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductList = ({ products, editProduct, deleteProduct }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    // Filter products based on selected category
    if (category === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  const categories = [...new Set(products.map((product) => product.category))]; // Get unique categories

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <div className={styles.filterContainer}>
        <label htmlFor="category" className={styles.filterLabel}>Lọc theo danh mục:</label>
        <select 
          id="category" 
          className={styles.filterSelect} 
          value={selectedCategory} 
          onChange={handleCategoryChange}
        >
          <option value="">Tất cả</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
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
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles['product-image']}
                  />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price} VND</td>
              <td>{product.category}</td>
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
                  onClick={() => deleteProduct(product.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
