import React, { useState, useEffect } from 'react';
import styles from './Product.module.css'; // Import CSS module

const ProductForm = ({ addProduct, editingProduct, updateProduct, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [id, setId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [stock, setStock] = useState('');

  // Fill the form if editing a product
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setImage(null);  // Reset image when editing a product (clear the old file preview)
      setImageName(editingProduct.imageName || '');
      setId(editingProduct._id || null);  // Ensure '_id' is being used
      setCategoryId(editingProduct.category?._id || '');
      setCategoryName(editingProduct.category?.name || '');
      setStock(editingProduct.stock || '');
    }
  }, [editingProduct]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);
    setCategoryId(selectedCategoryId);
    setCategoryName(selectedCategory ? selectedCategory.name : '');
  };

  // Handle adding a new product
  const handleAddProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', categoryId);
    formData.append('stock', stock);

    if (image) {
      formData.append('img', image);
    }

    addProduct(formData);

    // Reset form after submit
    resetForm();
  };

  // Handle updating an existing product
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!id) {
      console.error("Product ID is missing!");
      return; // Do not proceed without a valid ID
    }

    const formData = new FormData();
    formData.append('id', id);  // Ensure the correct 'id' format
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', categoryId);
    formData.append('stock', stock);

    if (image) {
      formData.append('img', image);
    }

    updateProduct(formData); // Call updateProduct and pass formData
    resetForm();
  };

  // Reset form fields after add or update
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    setImageName('');
    setCategoryId('');
    setCategoryName('');
    setStock('');
    setId(null);
    document.getElementById('image-input').value = ''; // Reset file input
  };

  return (
    <div>
      <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      <form className={styles.form} onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
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
          value={categoryId}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
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

        

        {/* Display current image if editing */}

        {editingProduct && editingProduct.img && (
          <div>
            {/* Kiểm tra và sửa lại đường dẫn nếu cần */}
            <p>Current Image:</p>
            <img
              src={editingProduct.img 
                ? `${import.meta.env.VITE_API_URL}${editingProduct.img.replace(/\\/g, '/')}`
                : null} 
              alt="Current Pic" 
              className={styles.preview} 
              
            />
            <p>New Image:</p>
          </div>
          
        )}
       
        {/* Show the preview of the new image if selected */}
        {image && <img src={URL.createObjectURL(image)} alt="Preview" className={styles.preview} />}

        <button className={styles.button} type="submit">
          {editingProduct ? 'Cập nhật' : 'Thêm'}
        </button>
      </form>

      {categoryName && <div className={styles.categoryName}>Danh mục: {categoryName}</div>}
    </div>
  );
};

export default ProductForm;
