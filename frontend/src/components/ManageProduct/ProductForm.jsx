import React, { useState, useEffect } from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductForm = ({ addProduct, editingProduct, updateProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [id, setId] = useState(null);
  const [category, setCategory] = useState(''); // New state for category
  const [stock, setStock] = useState(''); // New state for stock

  // Categories for the dropdown
  const categories = ['Electronics', 'Clothing', 'Books', 'Home Appliances'];

  // When editing a product, fill the form with existing data
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setImage(editingProduct.image || null);
      setImageName(editingProduct.imageName || '');
      setId(editingProduct.id);
      setCategory(editingProduct.category || ''); // Set category if editing
      setStock(editingProduct.stock || ''); // Set stock if editing
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Store base64 URL
        setImageName(file.name); // Store file name
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
      stock 
    };

    if (editingProduct) {
      updateProduct(product); // Call the update product function
    } else {
      addProduct(product); // Call the add product function
    }

    // Reset form and clear the file input
    setName('');
    setDescription('');
    setPrice('');
    setImage(null); // Reset image
    setImageName(''); // Clear image name
    setCategory(''); // Reset category
    setStock(''); // Reset stock
    setId(null); // Reset ID

    // Manually clear the file input by resetting the key
    document.getElementById('image-input').value = ''; // Reset the file input element
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
          id="image-input" // Set an id for the image input
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
