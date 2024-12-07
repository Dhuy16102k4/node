
// import React, { useState, useEffect } from 'react';
// import styles from './Product.module.css'; // Import CSS module

// const ProductForm = ({ addProduct, editingProduct, updateProduct, categories }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [image, setImage] = useState(null);
//   const [imageName, setImageName] = useState('');
//   const [id, setId] = useState(null);
//   const [categoryId, setCategoryId] = useState('');
//   const [categoryName, setCategoryName] = useState('');
//   const [stock, setStock] = useState('');

//   // Fill the form if editing a product
//   useEffect(() => {
//     if (editingProduct) {
//       setName(editingProduct.name);
//       setDescription(editingProduct.description);
//       setPrice(editingProduct.price);
//       setImage(editingProduct.image || null);
//       setImageName(editingProduct.imageName || '');
//       setId(editingProduct._id || null);  // Ensure '_id' is being used
//       setCategoryId(editingProduct.category?._id || '');
//       setCategoryName(editingProduct.category?.name || '');
//       setStock(editingProduct.stock || '');
//     }
//   }, [editingProduct]);
  
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImageName(file.name);
//     }
//   };

//   const handleCategoryChange = (e) => {
//     const selectedCategoryId = e.target.value;
//     const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);
//     setCategoryId(selectedCategoryId);
//     setCategoryName(selectedCategory ? selectedCategory.name : '');
//   };

//   // Handle adding a new product
//   const handleAddProduct = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('price', price);
//     formData.append('category', categoryId);
//     formData.append('stock', stock);

//     if (image) {
//       formData.append('img', image);
//     }

//     addProduct(formData);

//     // Reset form after submit
//     resetForm();
//   };

//   // Handle updating an existing product
//   const handleUpdateProduct = (e) => {
//     e.preventDefault();
//     console.log("Product ID:", id);  // Debug: Check id value
    
//     if (!id) {
//       console.error("Product ID is missing!");
//       return; // Do not proceed without a valid ID
//     }
  
//     const formData = new FormData();
//     formData.append('id', id);  // Ensure the correct 'id' format
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('price', price);
//     formData.append('category', categoryId);
//     formData.append('stock', stock);
  
//     if (image) {
//       formData.append('img', image);
//     }
  
//     updateProduct(formData);
//     resetForm();
//   };
  
  
  

//   // Reset form fields after add or update
//   const resetForm = () => {
//     setName('');
//     setDescription('');
//     setPrice('');
//     setImage(null);
//     setImageName('');
//     setCategoryId('');
//     setCategoryName('');
//     setStock('');
//     setId(null);
//     document.getElementById('image-input').value = ''; // Reset file input
//   };

//   return (
//     <div>
//       <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
//       <form className={styles.form} onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
//         <input
//           type="text"
//           className={styles.input}
//           placeholder="Tên sản phẩm"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <textarea
//           className={styles.textarea}
//           placeholder="Mô tả sản phẩm"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>
//         <input
//           type="number"
//           className={styles.input}
//           placeholder="Giá sản phẩm"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <select
//           className={styles.input}
//           value={categoryId}
//           onChange={handleCategoryChange}
//           required
//         >
//           <option value="">Chọn danh mục</option>
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat._id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           className={styles.input}
//           placeholder="Số lượng trong kho"
//           value={stock}
//           onChange={(e) => setStock(e.target.value)}
//           required
//         />
//         <input
//           id="image-input"
//           type="file"
//           className={styles.input}
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//         {imageName && <div className={styles.fileName}>Tệp đã chọn: {imageName}</div>}
//         {image && <img src={URL.createObjectURL(image)} alt="Preview" className={styles.preview} />}
//         <button className={styles.button} type="submit">
//           {editingProduct ? 'Cập nhật' : 'Thêm'}
//         </button>
//       </form>

//       {categoryName && <div className={styles.categoryName}>Danh mục: {categoryName}</div>}
//     </div>
//   );
// };

// export default ProductForm;

// //
// import React, { useState, useEffect } from 'react';
// import ProductList from './ProductList';
// import ProductForm from './ProductForm';
// import Modal from './Modal';
// import styles from './Product.module.css';
// import axiosInstance from '../../../utils/axiosConfig'; // Axios instance for API calls
// import Pagination from '../../Pagination/Pagination';

// const Product = () => {
//   const [products, setProducts] = useState([]); // List of products
//   const [categories, setCategories] = useState([]); // List of categories
//   const [editingProduct, setEditingProduct] = useState(null); // Product being edited
//   const [currentPage, setCurrentPage] = useState(1); // Current page
//   const [totalPages, setTotalPages] = useState(1); // Total pages
//   const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for filtering
//   const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // Modal state for adding
//   const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false); // Modal state for editing
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [id, setId] = useState(null);
//   const productsPerPage = 3; // Products per page

//   // Fetch products and categories
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axiosInstance.get('/admin/product/', {
//           params: {
//             category: selectedCategory === 'All' ? '' : selectedCategory,
//             page: currentPage,
//             limit: productsPerPage,
//           },
//         });
  
//         setProducts(response.data.products);
//         setTotalPages(response.data.totalPages);
//       } catch (err) {
//         setError('Failed to load products. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchProducts();
//   }, [selectedCategory, currentPage, productsPerPage]);
  
//   // UseEffect để lấy lại danh mục sau khi sản phẩm thay đổi
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const categoriesResponse = await axiosInstance.get('/category');
//       setCategories(categoriesResponse.data.categories || []);
//     };
  
//     fetchCategories();
//   }, [products]);
  
//   const addProduct = async (formData) => {
//     try {
//       const response = await axiosInstance.post('/admin/product/add', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       console.log('Response from backend:', response);
//       // Cập nhật danh sách sản phẩm sau khi thêm mới
//       setProducts((prevProducts) => [...prevProducts, response.data.savedProduct]);
  
//       // Cập nhật lại danh mục sau khi thêm sản phẩm
//       const categoriesResponse = await axiosInstance.get('/category');
//       setCategories(categoriesResponse.data.categories || []);
  
//     } catch (err) {
//       console.error('Failed to add product:', err);
//     }
//   };
  
//   const updateProduct = async (formData) => {
//     try {
//       const response = await axiosInstance.put(`/admin/product/${formData.get('id')}`, formData);
//       console.log('Updated product response:', response.data);
  
//       // Cập nhật lại danh sách sản phẩm
//       setProducts((prevProducts) =>
//         prevProducts.map((product) =>
//           product._id === formData.get('id') ? response.data.updatedProduct : product
//         )
//       );
  
//       // Cập nhật lại danh mục sau khi cập nhật sản phẩm
//       const categoriesResponse = await axiosInstance.get('/category');
//       setCategories(categoriesResponse.data.categories || []);
  
//       setEditingProduct(null);
//       setIsEditProductModalOpen(false);
  
//     } catch (err) {
//       console.error('Failed to update product:', err);
//     }
//   };
  
  
//   // Delete a product
//   const deleteProduct = async (productId) => {
//     try {
//       await axiosInstance.delete(`/admin/product/${productId}`);
//       setProducts((prev) => prev.filter((product) => product._id !== productId));
//     } catch (err) {
//       console.error('Error deleting product:', err);
//     }
//   };

//   // Pagination controls
//   const goToNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const goToPrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   // Modal controls
//   const openAddProductModal = () => setIsAddProductModalOpen(true);
//   const closeAddProductModal = () => setIsAddProductModalOpen(false);

//   const openEditProductModal = (product) => {
//   setEditingProduct(product);
//   setId(product._id ? product._id.toString() : null);  // Ensure the id is set properly (usually it's `_id`)
//   setIsEditProductModalOpen(true);
// };

  
  

//   const closeEditProductModal = () => {
//     setEditingProduct(null);
//     setIsEditProductModalOpen(false);
//   };

//   return (
//     <div className={styles['admin-container']}>
//       <h1 className={styles.header}>Quản lý sản phẩm</h1>

//       {/* Add Product Button */}
//       <button className={styles.addProductButton} onClick={openAddProductModal}>
//         <span className={styles.plusSign}></span> Add Product
//       </button>

//       {/* Add Product Modal */}
//       <Modal isOpen={isAddProductModalOpen} closeModal={closeAddProductModal}>
//         <ProductForm
//           addProduct={addProduct}
//           categories={categories} // Pass categories to the form
//         />
//       </Modal>

//       {/* Edit Product Modal */}
//       <Modal isOpen={isEditProductModalOpen} closeModal={closeEditProductModal}>
//       <ProductForm
//         updateProduct={updateProduct}
//         editingProduct={editingProduct}
//         categories={categories}
//         setId={setId}  // Ensure setId is passed here
//       />

//       </Modal>

//       {/* Error Message */}
//       {error && <div className={styles.errorMessage}>{error}</div>}

//       {/* Loading State */}
//       {loading ? (
//         <div className={styles.loading}>Loading products...</div>
//       ) : (
//         <ProductList
//           products={products}
//           editProduct={openEditProductModal}
//           deleteProduct={deleteProduct}
//           categories={categories} // Pass categories to filter list
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory} // Pass function to update category
//         />
//       )}

//       {/* Pagination */}
//       <div className={styles.pagination}>
//         <button
//           className={styles.button}
//           onClick={goToPrevPage}
//           disabled={currentPage === 1}
//         >
//           Trang trước
//         </button>

//         <span className={styles.pageNumber}>{currentPage}</span>

//         <button
//           className={styles.button}
//           onClick={goToNextPage}
//           disabled={currentPage >= totalPages}
//         >
//           Trang sau
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Product;




