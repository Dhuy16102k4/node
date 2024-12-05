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
        const { productId, action } = req.body; // action: "remove" or "decrement"
        try {
            // Find the user's cart
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Find the product in the cart
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            const productInCart = cart.products[productIndex];
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (action === 'decrement') {
                // If action is 'decrement', decrease the quantity by 1
                if (productInCart.quantity > 1) {
                    productInCart.quantity -= 1; // Decrease quantity
                    product.stock += 1; // Increase stock
                } else {
                    // If quantity is 1, remove product completely
                    cart.products.splice(productIndex, 1); // Remove the product
                    product.stock += 1; // Increase stock
                }
            } else if (action === 'remove') {
                // If action is 'remove', completely remove the product from the cart
                cart.products.splice(productIndex, 1); // Remove product
                product.stock += productInCart.quantity; // Add back the stock
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }

            // Save updated cart and product
            await cart.save();
            await product.save();

            res.status(200).json({ message: 'Cart updated successfully', cart });
        } catch (err) {
            return res.status(500).json({ message: 'Error updating cart', error: err.message });
        }
    }

    // cartController.js
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

        console.log("Updated product selection:", product); // Keep your debug logs for easier tracking
        res.status(200).json({ message: 'Product selection updated', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error updating selection', error: err.message });
    }
}

}

module.exports = new CartController();
