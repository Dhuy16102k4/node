import React, { useState, useEffect } from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductForm = ({ addProduct, editingProduct, updateProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [id, setId] = useState(null);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const categories = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];

  // Khi chỉnh sửa sản phẩm, điền thông tin vào form
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setImage(editingProduct.image || null);
      setImageName(editingProduct.imageName || '');
      setId(editingProduct.id);
      setCategory(editingProduct.category || '');
      setStock(editingProduct.stock || '');
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      id: id || Date.now(),
      name,
      description,
      price,
      image,
      imageName,
      category,
      stock,
    };

    if (editingProduct) {
      updateProduct(product); // Cập nhật sản phẩm
    } else {
      addProduct(product); // Thêm sản phẩm mới
    }

    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    setImageName('');
    setCategory('');
    setStock('');
    setId(null);

    document.getElementById('image-input').value = ''; // Reset file input
  };

  return (
    <div>
      <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Mô tả sản phẩm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="number"
          className={styles.input}
          placeholder="Giá sản phẩm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          className={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          className={styles.input}
          placeholder="Số lượng trong kho"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <input
          id="image-input"
          type="file"
          className={styles.input}
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageName && <div className={styles.fileName}>Tệp đã chọn: {imageName}</div>}
        {image && <img src={image} alt="Preview" className={styles.preview} />}
        <button className={styles.button} type="submit">
          {editingProduct ? 'Cập nhật' : 'Thêm'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
