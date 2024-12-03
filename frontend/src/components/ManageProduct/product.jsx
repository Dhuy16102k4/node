import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import styles from './Product.module.css'; // Import CSS module

const Product = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const productsPerPage = 3; // Số sản phẩm mỗi trang

  // Thêm sản phẩm mới
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  // Chỉnh sửa sản phẩm
  const editProduct = (product) => {
    setEditingProduct(product);
  };

  // Cập nhật sản phẩm
  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null); // Reset trạng thái chỉnh sửa
  };

  // Xóa sản phẩm
  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Lấy sản phẩm của trang hiện tại
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Điều hướng trang
  const goToNextPage = () => {
    if (currentPage * productsPerPage < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles['admin-container']}>
      <h1 className={styles.header}>Quản lý sản phẩm</h1>
      <ProductForm
        addProduct={addProduct}
        editingProduct={editingProduct}
        updateProduct={updateProduct}
      />
      <ProductList
        products={currentProducts}
        editProduct={editProduct}
        deleteProduct={deleteProduct}
      />
<div className={styles.pagination}>
  <button
    className={styles.button}
    onClick={goToPrevPage}
    disabled={currentPage === 1}
  >
    Trang trước
  </button>
  
  <span className={styles.pageNumber}>{currentPage}</span> {/* Display current page number */}

  <button
    className={styles.button}
    onClick={goToNextPage}
    disabled={currentPage * productsPerPage >= products.length}
  >
    Trang sau
  </button>
</div>
    </div>
  );
};

export default Product;
