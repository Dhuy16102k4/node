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

                const newQuantity = cart.products[existingProductIndex].quantity + quantity;
                if (newQuantity > product.stock) {
                    return res.status(400).json({ message: 'Cannot add more than available stock' });
                }
  
                cart.products[existingProductIndex].quantity += quantity;
            } else {

                if (quantity > product.stock) {
                    return res.status(400).json({ message: 'Cannot add more than available stock' });
                }
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }
    
            await cart.save();
      
            await product.save();
    
          
            res.status(200).json({ message: 'Product added to cart', cart });
        } catch (err) {
            res.status(500).json({ message: 'Error adding to cart', error: err.message });
        }
    }
    
    
    async removeCart(req, res) {
        const { productId, action } = req.body; 
    
        try {
            // Step 1: Find the user's cart
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
    
            // Step 2: Find the product in the cart
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
    
            const productInCart = cart.products[productIndex];
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            const initialStock = product.initialStock || product.stock;
            
            if (action === 'decrement') {
             
                if (productInCart.quantity > 1) {
                    productInCart.quantity -= 1; // Decrease quantity
                     // Increase stock
                } else {
                    // If quantity is 1, remove product completely
                    cart.products.splice(productIndex, 1); // Remove the product
                     // Increase stock
                }
    
            } else if (action === 'remove') {
                // If action is 'remove', completely remove the product from the cart
                cart.products.splice(productIndex, 1); // Remove product
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
    
            // Step 5: Save the updated cart and product details
            await cart.save();
            await product.save();
    
            // Step 6: Respond with success message and updated cart
            res.status(200).json({ message: 'Cart updated successfully', cart });
    
        } catch (err) {
            // Step 7: Catch any errors and return an error message
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