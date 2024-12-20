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
  const [loadingCategories, setLoadingCategories] = useState(true); // Category loading state

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

  useEffect(() => {
    // Ensure categories are fully loaded
    if (categories.length > 0) {
      setLoadingCategories(false); // Mark categories as loaded
    }
  }, [categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Update the image state with the selected file
      setImageName(file.name); // Optionally store the file name
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
      formData.append('img', image); // Append the image file if selected
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
      formData.append('img', image); // Append the image file if selected
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
    document.getElementById('image-input').value = ''; // Reset image input
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
        
        {/* Dropdown for Category */}
        <select
          className={styles.input}
          value={categoryId}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Choose Category</option>
          {loadingCategories ? (
            <option value="">Loading categories...</option>
          ) : (
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))
          )}
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

        {/* Image Preview */}
        {image && (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imageWrapper}>
              <p>Selected Image:</p>
              <img
                src={URL.createObjectURL(image)} // Preview the selected image
                alt="Image Preview"
                className={styles.preview}
              />
            </div>
          </div>
        )}

        {editingProduct && editingProduct.img && !image && (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imageWrapper}>
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_API_URL}${editingProduct.img.replace(/\\/g, '/')}`}
                alt="Current Pic"
                className={styles.preview}
              />
            </div>
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
