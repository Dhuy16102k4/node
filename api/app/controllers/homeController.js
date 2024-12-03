
const mongoose = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/categories');
const { console } = require('inspector');


class homeController {
    async display(req, res, next) {
        try {
            const categoryId = req.query.category;
            const page = parseInt(req.query.page) || 1;
            const productPerPage = parseInt(req.query.limit) || 10;
            let filter = {};

            if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
                filter.category = new mongoose.Types.ObjectId(categoryId);
            } else if (categoryId) {
                return res.status(400).json({ message: 'Invalid category ID format.' });
            }

            const [products, totalProducts, categories] = await Promise.all([
                Product.find(filter)
                    .populate('category', 'name')
                    .skip((page - 1) * productPerPage)
                    .limit(productPerPage)
                    .lean(),
                Product.countDocuments(filter),
                Category.find().lean()
            ]);

            const totalPages = Math.ceil(totalProducts / productPerPage);
         
            res.json({ products, categories, currentPage: page, totalPages, limit: productPerPage });
        } catch (error) {
            console.error('Error in display function:', error);
            res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
        }
    }
    async productDetail(req, res) {
        console.log("123");
        const productId = req.params.id; 
        
        try {
            const product = await Product.findById(productId).populate('category', 'name').populate('reviews.user');
            if (!product) {
                return res.status(404).json({ message: 'product not found' });
            }

            const relatedProducts = await Product.find({ category: product.category._id }).populate('category', 'name');            
            
            res.status(200).json({product,relatedProducts,categoryName: product.category.name });

        } catch (err) {
            res.status(500).json({ message: 'Error fetching order', error: err.message });
        }
    }
    async addComment(req, res){
        const productId = req.params.id; 
        //from token
        //const user = req.user._id;
        const { comment, rating } = req.body; 
        if (!comment || !rating ) {
            return res.status(400).json({ message: 'Comment, rating, and userId are required.' });
        }
        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: 'Rating must be between 1 and 10.' });
        }
        try {
            const product = await Product.findById(productId).populate('reviews.user');
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const newReview = {
                user: req.user._id,
                name: req.user.username,
                comment,
                rating,
                createdAt: new Date()
            }
            product.reviews.push(newReview);
            product.calculateAverageRating();
            await product.save();
            res.status(201).json({ message: 'Comment added successfully!', product, userName:  req.user.username });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to add comment.', error: err.message });
        }
    }
}
module.exports = new homeController();