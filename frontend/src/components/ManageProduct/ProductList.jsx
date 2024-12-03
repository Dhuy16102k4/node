import React from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductList = ({ products, editProduct, deleteProduct }) => {
  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul className={styles.list}>
        {products.map((product) => (
          <li className={styles['list-item']} key={product.id}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className={styles['product-image']}
              />
            )}
            <div className={styles['product-name']}>{product.name}</div>
            <div className={styles['product-price']}>{product.price} VND</div>
            <p className={styles['product-description']}>{product.description}</p>
            <div className={styles['product-category']}>Danh mục: {product.category}</div>
            <div className={styles['product-stock']}>Số lượng trong kho: {product.stock}</div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.button}
                onClick={() => editProduct(product)} // Gọi hàm sửa sản phẩm
              >
                Sửa
              </button>
              <button
                className={styles.button}
                onClick={() => deleteProduct(product.id)} // Gọi hàm xóa sản phẩm
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
