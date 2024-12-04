import React from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductList = ({ products, editProduct, deleteProduct }) => {
  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
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
          {products.map((product) => (
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
