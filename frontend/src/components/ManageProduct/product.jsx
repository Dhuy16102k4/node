import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Modal from './modal';
import styles from './Product.module.css'; // Import CSS module

const Product = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal

  const productsPerPage = 3; // Số sản phẩm mỗi trang

  // Thêm sản phẩm mới
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  // Chỉnh sửa sản phẩm
  const editProduct = (product) => {
    setEditingProduct(product); // Cập nhật sản phẩm đang chỉnh sửa
    setIsModalOpen(true); // Mở modal khi sửa sản phẩm
  };

  // Cập nhật sản phẩm
  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null); // Reset trạng thái chỉnh sửa
    setIsModalOpen(false); // Đóng modal sau khi cập nhật
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

  // Mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null); // Reset trạng thái chỉnh sửa khi đóng modal
  };

  return (
    <div className={styles['admin-container']}>
      <h1 className={styles.header}>Quản lý sản phẩm</h1>
      
      {/* Nút thêm sản phẩm */}
      <button className={styles.addProductButton} onClick={openModal}>
        <span className={styles.plusSign}>+</span> Thêm sản phẩm
      </button>

      {/* Modal với form thêm sản phẩm */}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <ProductForm
          addProduct={addProduct}
          editingProduct={editingProduct}
          updateProduct={updateProduct}
        />
      </Modal>

      <ProductList
        products={currentProducts}
        editProduct={editProduct} // Sửa sản phẩm khi nhấn vào nút Sửa
        deleteProduct={deleteProduct}
      />

      {/* Phân trang */}
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
          disabled={currentPage * productsPerPage >= products.length}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Product;
