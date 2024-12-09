import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import styles from './Detail.module.css'; // import styles
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axiosInstance from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import jwt_decode from "jwt-decode";

const Detail = () => {
    const { id } = useParams();  
    const {formatPrice, addToCart} = useContext(StoreContext);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(''); 
    const { setshowOut, setShowAdd, setSuccessMessage } = useContext(AuthContext);
    const location = useLocation();
    const [quantity, setQuantity] = useState(1);
    const [submitReview, setSubmitReview] = useState("submit");
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('authToken');

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value)
    }

    const handleRatingChange = (event) => {
        setRating(event.target.value);
      };
    
    
    useEffect(() => {
        window.scrollTo(0, 0);  

        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/detail/${id}`);
                console.log(response.data); 
                const product = response?.data?.product;
                const relatedProducts = response?.data?.relatedProducts.slice(0, 4).filter((related) => related._id !== id);

                const userList = product?.reviews?.map((review) => review.user.username);
                
                if (product && product.img) {
                    product.img = product.img.replace(/\\/g, '/');
                }

                const averageRating = product.reviews.length > 0
                ? Math.round(
                    product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length
                )
                : 0;

                product.averageRating = averageRating;
                
                
                setProduct(product); 
                setRelatedProducts(relatedProducts);  
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false); 
            }
        };
        setQuantity(1);
        fetchProduct();
    }, [id, location]); 

    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>; 
    }

    const handleAddToCart = async (quantity) => {
        if(token){
            try {
                if (quantity > product.stock) {
                    throw new Error(`Insufficient stock. Only ${stock} items available.`);
                }
                await addToCart(id, quantity);

                setSuccessMessage("Product added to cart")
                setShowAdd(true);
                setError('');
            } catch (err) {
                setshowOut(true);
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } else {
            alert("Login before adding to cart")
        }
      };

      const handleCommentSubmit = async () => {
        // Validate input fields
        if (!token) {
            setMessage('*Please login before posting comment');
            return;
        }
    
        try {
            const response = await axiosInstance.post(`/detail/${id}`,
                { comment, rating },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token for authentication
                    },
                }
            );

            const newReview = {
                user: {
                    username: !token?"":jwt_decode(token).username,
                },
                comment: comment,
                rating: rating,
            };
    

            setProduct((prevProduct) => {
                const updatedReviews = [newReview, ...prevProduct.reviews]; 
                const totalRating = product.reviews.reduce((total, review) => total + review.rating, 0) + rating
                const updatedRating = Math.round(totalRating / updatedReviews.length);

                return {
                    ...prevProduct,
                    reviews: updatedReviews,
                    averageRating: product.averageRating,
                };
            });
    
            // Reset form state after submitting
            setSubmitReview("submit");
            setComment('');
            setRating(1);
    
        } catch (error) {
            // Handle error
            setMessage(error.response?.data?.message || 'Failed to add comment.');
        }
    };
    
    const formatPriceWithDots = (price) => {
        return price
          .toString()   // Chuyển giá trị sang chuỗi
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm sau mỗi 3 chữ số
      };
    
  return (
    <div>
        <main>
            <div className={styles.container}> {/* Sử dụng styles.container */}
            {/* Product Page Section */}
            <section className={styles['product-page']}> {/* Sử dụng styles['product-page'] */}
                <div className={styles['product-images']}> {/* Sử dụng styles['product-images'] */}
                    <div className={styles['main-image-container']}> {/* Sử dụng styles['main-image-container'] */}
                        <img 
                        src={`${import.meta.env.VITE_API_URL}${product.img}`}
                        alt="Product Image" 
                        className={styles['main-image']}
                        />
                        <div className={styles['floating-circles']}> {/* Sử dụng styles['floating-circles'] */}
                        <div className={styles.circle}></div> {/* Sử dụng styles.circle */}
                        <div className={styles.circle}></div> {/* Sử dụng styles.circle */}
                        <div className={styles.circle}></div> {/* Sử dụng styles.circle */}
                        </div>
                    </div>
                </div>
                <div className={styles['product-info']}> {/* Sử dụng styles['product-info'] */}
                <h1>{product.name}</h1>
                <p className={styles.price}>{formatPriceWithDots(product.price)} VND</p> {/* Sử dụng styles.price */}
                <div className={styles.rating}> Average point:{product.averageRating}⭐ ({product.reviews.length} reviews)</div> {/* Sử dụng styles.rating */}
                <p className={styles.description}> {/* Sử dụng styles.description */}
                    {product.description}
                </p>
                <div className={styles.quantity}> {/* Sử dụng styles.quantity */}
                    <label htmlFor="quantity">Quantity:</label>
                    <input 
                    type="number" 
                    id="quantity" 
                    value={quantity}
                    aria-label="Quantity"
                    onChange={handleQuantityChange}
                    min="1"
                    />
                </div>
                <button className={styles['add-to-cart']} aria-label="Add to Cart" onClick={() => handleAddToCart(quantity)}> {/* Sử dụng styles['add-to-cart'] */}
                    Add to Cart
                </button>
                </div>
            </section>
            
            
            {/* Related Products Section */}
            <section className={styles['related-products']}> {/* Sử dụng styles['related-products'] */}
                <h2 className={styles['recommended-pro']}>Recommended Products</h2>
                <div className={styles['product-grid']}>
                    {relatedProducts.map((relatedProduct) => (
                        <div  className={styles['product']} key={relatedProduct._id}>
                        
                            <img onClick={()=> navigate(`/detail/${relatedProduct._id}`)}
                                src={`${import.meta.env.VITE_API_URL}${relatedProduct.img.replace(/\\/g, '/')}`}
                                loading="lazy"
                                className="lazy"
                            />
                        
                        <p>{relatedProduct.name}</p>
                        <p className={styles.relatedPrice}>{formatPriceWithDots(relatedProduct.price )} VND</p>
                        </div>
                        
                    ))}
                </div>
            </section>
            <br/>
            
            {/* Reviews Section */}
                <section className={styles.reviews}>
                    <h2>Customer Reviews</h2>
                        <div className={styles['review-summary']}>
                        Average point: {product.averageRating}⭐ ({product.reviews.length} reviews)
                        </div>
                        <div className={styles["review-list"]}>
                        {product.reviews.map((review) => (
                            <div className={styles.review} key={review._id}>
                                <p>
                                    <img src={assets.profile_icon} alt="User profile" />
                                    <strong>{review.user.username}</strong> ({review.rating}/10⭐)
                                </p>
                                <p className={styles.reviewContent}>{review.comment}</p>
                                <hr />
                            </div>
                        ))}
                        </div>
                            <div className={styles["write-review"]}>
                            {submitReview === "submit" ? (
                                    <button onClick={() => setSubmitReview("form")}>Write a review</button>
                                ) : (
                                    <>
                                        {/* <input  type="text" placeholder="Your name" /> */}
                                        <textarea onChange={handleCommentChange}  name="" id="" placeholder="Your review" />
                                        <select onChange={handleRatingChange} id="product-option" name="product-option">
                                            <option value="" disabled selected>Rating (1-10⭐)</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                        <button onClick={() => handleCommentSubmit()}>Submit</button>
                                        <button onClick={() => (setSubmitReview("submit"), setMessage('')) }>Cancel</button>
                                        <div className={styles.Error}>{message}</div>
                                    </>
                                )}
                            </div>  
                </section>
            </div>
        </main>
    </div>
  );
};

export default Detail;
