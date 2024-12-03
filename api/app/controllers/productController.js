const mongoose = require('mongoose');
const Product = require('../models/products');
const Category = require('../models/categories');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { console } = require('inspector');

// Cấu hình multer cho việc tải ảnh lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imgDir = path.join(__dirname, '../../public/img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }
        cb(null, imgDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

class ProductController {
    async display(req, res, next) {
        try {
            const categoryId = req.query.category;
            const page = parseInt(req.query.page) || 1;
            const productPerPage = parseInt(req.query.limit) || 3;
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
            console.log({ products, categories, currentPage: page, totalPages, limit: productPerPage });
            res.json({ products, categories, currentPage: page, totalPages, limit: productPerPage });
        } catch (error) {
            console.error('Error in display function:', error);
            res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
        }
    }

    add(req, res, next) {
        const { name, price, description, category ,stock} = req.body;
        console.log({ name, price, description, category ,stock})
        if (!name || !price || !description || !category || !stock || !req.file) {
            return res.status(400).json({ message: 'All fields are required, including the image.' });
        }

        Category.findById(category)
            .then(categoryObj => {
                if (!categoryObj) return res.status(400).json({ message: 'Invalid category ID.' });

                const imgPath = path.join('/img', req.file.filename);
                const newProduct = new Product({ name, price, description, category: categoryObj._id, stock, img: imgPath });

                return newProduct.save();
            })
            .then(savedProduct => {
                res.status(201).json({ savedProduct, message: 'Product added successfully!' });
            })
            .catch(error => {
                console.error('Error adding product:', error);
                res.status(500).json({ message: 'Failed to add product.' });
            });
    }

    update(req, res, next) {
        const productId = req.params.id;
        const { name, price, description, category } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        Category.findById(category)
            .then(categoryObj => {
                if (!categoryObj) return res.status(400).json({ message: 'Invalid category ID.' });

                const imgPath = req.file ? path.join('/img', req.file.filename) : req.body.img;

                return Product.findByIdAndUpdate(
                    productId,
                    { name, price, description, category: categoryObj._id, img: imgPath },
                    { new: true }
                );
            })
            .then(updatedProduct => {
                if (!updatedProduct) return res.status(404).json({ message: 'Product not found.' });
                res.status(200).json({ updatedProduct, message: 'Product updated successfully!' });
            })
            .catch(error => {
                console.error('Error updating product:', error);
                res.status(500).json({ message: 'Failed to update product.' });
            });
    }


    delete(req, res, next) {
        const productId = req.params.id;
        console.log('Product ID to delete:', productId);

        Product.deleteOne({ _id: productId })
            .then(result => {
                if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found.' });
                res.status(200).json({ message: 'Product deleted successfully!' });
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                res.status(500).json({ message: 'Failed to delete product.' });
            });
    }
    
}

module.exports = {
    upload,
    productRouter: new ProductController()
};
