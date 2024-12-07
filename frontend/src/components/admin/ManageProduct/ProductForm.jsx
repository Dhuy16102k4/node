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
      setImage(null); // Reset image when editing a product
      setImageName(editingProduct.imageName || '');
      setId(editingProduct._id || null);
      setCategoryId(editingProduct.category?._id || '');
      setCategoryName(editingProduct.category?.name || '');
      setStock(editingProduct.stock || '');
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);
    setCategoryId(selectedCategoryId);
    setCategoryName(selectedCategory ? selectedCategory.name : '');
  };

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
    resetForm();
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!id) {
      console.error('Product ID is missing!');
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', categoryId);
    formData.append('stock', stock);

    if (image) {
      formData.append('img', image);
    }

    updateProduct(formData);
    resetForm();
  };

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
    document.getElementById('image-input').value = '';
  };

  return (
    <div>
      <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
      <form className={styles.form} onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <input
          type="text"
          className={styles.input}
          placeholder="Name Product"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="number"
          className={styles.input}
          placeholder="Price"
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
          <option value="">Choose Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          className={styles.input}
          placeholder="Quantity In Stock"
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

        {editingProduct && editingProduct.img && (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imageWrapper}>
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_API_URL}${editingProduct.img.replace(/\\/g, '/')}`}
                alt="Current Pic"
                className={styles.preview}
              />
            </div>
            {image && (
              <div className={styles.imageWrapper}>
                <p>New Image:</p>
                <img src={URL.createObjectURL(image)} alt="Preview" className={styles.preview} />
              </div>
            )}
          </div>
        )}

        <button className={`${styles.button} ${styles.adddButton}`} type="submit">
          {editingProduct ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
