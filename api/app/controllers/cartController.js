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
    
        // Ensure quantity is a valid number and greater than 0
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity.' });
        }
    
        // Check if productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }
    
        try {
            // Fetch the product
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Ensure sufficient stock is available
            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
    
            // Find the user's cart
            let cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                // If cart does not exist, create a new one
                cart = new Cart({ user: req.user._id, products: [] });
            }
    
            // Check if product already exists in the cart
            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex >= 0) {
                // If the product exists, check if adding the new quantity exceeds stock
                const newQuantity = cart.products[existingProductIndex].quantity + quantity;
                if (newQuantity > product.stock) {
                    return res.status(400).json({ message: 'Cannot add more than available stock' });
                }
                // Update the quantity in the cart
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // If the product doesn't exist, add it to the cart
                if (quantity > product.stock) {
                    return res.status(400).json({ message: 'Cannot add more than available stock' });
                }
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }
    
            // Save the cart and update the product stock
            await cart.save();
           
            await product.save();
    
            // Respond with success message and updated cart
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
    
            // Step 3: Ensure we track the original stock value for proper stock update
            const initialStock = product.initialStock || product.stock; // Save the original stock value
            
            // Step 4: Handle the decrement action
            if (action === 'decrement') {
                // If the quantity is greater than 1, decrease it by 1 and update stock
                if (productInCart.quantity > 1) {
                    productInCart.quantity -= 1;
                    product.stock = Math.min(product.stock + 1, initialStock);  // Increase stock but don't exceed initial stock
                } else {
                    // If the quantity is 1, remove the product from the cart entirely
                    cart.products.splice(productIndex, 1);
                    product.stock = Math.min(product.stock + 1, initialStock);  // Ensure stock doesn't exceed initial stock
                }
    
            // Step 5: Handle the remove action
            } else if (action === 'remove') {
                // Remove the product completely from the cart and return the full quantity to stock
                const quantityToReturn = productInCart.quantity;
                cart.products.splice(productIndex, 1); // Completely remove the product
                product.stock = Math.min(product.stock + quantityToReturn, initialStock); // Return stock but don't exceed initial stock
    
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
    
            // Step 6: Save the updated cart and product details
            await cart.save();
            await product.save();
    
            // Step 7: Respond with success message and updated cart
            res.status(200).json({ message: 'Cart updated successfully', cart });
    
        } catch (err) {
            // Step 8: Catch any errors and return an error message
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