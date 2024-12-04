const Cart = require('../models/carts');
const Product = require('../models/products');
const mongoose = require('mongoose');

class CartController {

    async getCart(req, res) {
        try {
            const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
            if (!cart) {
                return res.status(200).json({
                    message: 'Cart is empty',
                    cart: { user: req.user._id, products: [] }
                });
            }
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching cart', error: err.message });
        }
    }

    async addCart(req, res) {
        console.log("Request Body:", req.body);
        let { productId, quantity } = req.body;
    
        // Ensure quantity is a valid number and remove trim if quantity is already a number
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity.' });
        }
    
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }
    
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
    
            let cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                cart = new Cart({ user: req.user._id, products: [] });
            }
    
            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex >= 0) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }
    
            await cart.save();
            product.stock -= quantity;
            await product.save();
    
            res.status(200).json({ message: 'Product added to cart', cart });
        } catch (err) {
            res.status(500).json({ message: 'Error adding to cart', error: err.message });
        }
    }
    
    async removeCart(req, res) {
        const productId = req.params.id; 
        try {
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const initialLength = cart.products.length;
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            if (cart.products.length === initialLength) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            await cart.save();
            res.status(200).json({ message: 'Product removed from cart', cart });
        } catch (err) {
            return res.status(500).json({ message: 'Error removing product from cart', error: err.message });
        }
    }

    async selectItems(req, res) {
        const { productId, isSelected } = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }
        try {
            const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const product = cart.products.find(item => item.product._id.toString() === productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            // Update product selection status
            product.isSelected = isSelected;
            await cart.save();

            res.status(200).json({ message: 'Product selection updated', cart });
        } catch (err) {
            res.status(500).json({ message: 'Error updating selection', error: err.message });
        }
    }
}

module.exports = new CartController();
