// const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied, token missing' });
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid or expired token' });
//         }
//         req.user = decoded; // Đính kèm payload của token vào request để sử dụng
//         next();
//     });
// }

// module.exports = authenticateToken;
// const router = require('express').Router();
// const cartController = require('../app/controllers/cartController');
// const authenticateToken = require('../middlerware/authToken');

// // Route to add products to the cart
// router.post('/add', authenticateToken, cartController.addCart);

// // Route to update product selection (optional)
// router.put('/selected', authenticateToken, cartController.selectItems);

// // Route to handle removing or updating products in the cart (decrement or remove)
// router.post('/remove', authenticateToken, cartController.removeCart); // Changed to POST from DELETE

// // Route to get the user's cart
// router.get('/', authenticateToken, cartController.getCart);

// module.exports = router;
// const Cart = require('../models/carts');
// const Product = require('../models/products');
// const mongoose = require('mongoose');

// class CartController {

//     async getCart(req, res) {
//         try {
//             const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
//             if (!cart) {
//                 return res.status(200).json({
//                     message: 'Cart is empty',
//                     cart: { user: req.user._id, products: [] }
//                 });
//             }
//             res.status(200).json(cart);
//         } catch (err) {
//             res.status(500).json({ message: 'Error fetching cart', error: err.message });
//         }
//     }

//     async addCart(req, res) {
//         console.log("Request Body:", req.body);
//         let { productId, quantity } = req.body;
    
//         // Ensure quantity is a valid number and remove trim if quantity is already a number
//         if (isNaN(quantity) || quantity <= 0) {
//             return res.status(400).json({ message: 'Invalid quantity.' });
//         }
    
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return res.status(400).json({ message: 'Invalid product ID.' });
//         }
    
//         try {
//             const product = await Product.findById(productId);
//             if (!product) {
//                 return res.status(404).json({ message: 'Product not found' });
//             }
    
//             if (product.stock < quantity) {
//                 return res.status(400).json({ message: 'Insufficient stock' });
//             }
    
//             let cart = await Cart.findOne({ user: req.user._id });
//             if (!cart) {
//                 cart = new Cart({ user: req.user._id, products: [] });
//             }
    
//             const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
//             if (existingProductIndex >= 0) {
//                 cart.products[existingProductIndex].quantity += quantity;
//             } else {
//                 cart.products.push({
//                     product: productId,
//                     quantity: quantity,
//                     price: product.price
//                 });
//             }
    
//             await cart.save();
//             product.stock -= quantity;
//             await product.save();
    
//             res.status(200).json({ message: 'Product added to cart', cart });
//         } catch (err) {
//             res.status(500).json({ message: 'Error adding to cart', error: err.message });
//         }
//     }
    
//     async removeCart(req, res) {
//         const { productId, action } = req.body; // action: "remove" or "decrement"
//         try {
//             // Find the user's cart
//             const cart = await Cart.findOne({ user: req.user._id });
//             if (!cart) {
//                 return res.status(404).json({ message: 'Cart not found' });
//             }

//             // Find the product in the cart
//             const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
//             if (productIndex === -1) {
//                 return res.status(404).json({ message: 'Product not found in cart' });
//             }

//             const productInCart = cart.products[productIndex];
//             const product = await Product.findById(productId);
//             if (!product) {
//                 return res.status(404).json({ message: 'Product not found' });
//             }

//             if (action === 'decrement') {
//                 // If action is 'decrement', decrease the quantity by 1
//                 if (productInCart.quantity > 1) {
//                     productInCart.quantity -= 1; // Decrease quantity
//                     product.stock += 1; // Increase stock
//                 } else {
//                     // If quantity is 1, remove product completely
//                     cart.products.splice(productIndex, 1); // Remove the product
//                     product.stock += 1; // Increase stock
//                 }
//             } else if (action === 'remove') {
//                 // If action is 'remove', completely remove the product from the cart
//                 cart.products.splice(productIndex, 1); // Remove product
//                 product.stock += productInCart.quantity; // Add back the stock
//             } else {
//                 return res.status(400).json({ message: 'Invalid action' });
//             }

//             // Save updated cart and product
//             await cart.save();
//             await product.save();

//             res.status(200).json({ message: 'Cart updated successfully', cart });
//         } catch (err) {
//             return res.status(500).json({ message: 'Error updating cart', error: err.message });
//         }
//     }

//     // cartController.js
// async selectItems(req, res) {
//     const { productId, isSelected } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return res.status(400).json({ message: 'Invalid product ID.' });
//     }
//     try {
//         const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const product = cart.products.find(item => item.product._id.toString() === productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found in cart' });
//         }

//         // Update product selection status
//         product.isSelected = isSelected;
//         await cart.save();

//         console.log("Updated product selection:", product); // Keep your debug logs for easier tracking
//         res.status(200).json({ message: 'Product selection updated', cart });
//     } catch (err) {
//         res.status(500).json({ message: 'Error updating selection', error: err.message });
//     }
// }

// }

// module.exports = new CartController();
const Cart = require('../models/carts');
const Product = require('../models/products');
const Order = require('../models/orders');

async function findUserCart(userId) {
    return await Cart.findOne({ user: userId }).populate('products.product');
}
async function findUserOders(userId) {
    return await Order.find({ user: userId });
}



class OrderController {
    async display(req, res) {
        try {
            const orders = await findUserOders(req.user._id);
            if (!orders) {
                return res.status(404).json({ message: 'No orders found for this user' });
            }
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching orders', error: err.message });
        }
    }
    async add(req, res) {
        const { address, paymentMethod, phone } = req.body;
        try {
            const cart = await findUserCart(req.user._id);
            if (!cart) {
                return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
            }
            
            // Lọc các sản phẩm đã chọn
            const selectedProducts = cart.products.filter(item => item.isSelected);
            if (selectedProducts.length === 0) {
                return res.status(400).json({ message: 'No products selected for checkout.' });
            }
    
            const totalPrice = selectedProducts.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
            
            const order = new Order({
                user: req.user._id,
                products: selectedProducts.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice,
                address,
                phone, // Thêm phone vào đơn hàng
                paymentMethod,
                status: 'Pending',
            });
            
            await order.save();
            
            // Cập nhật giỏ hàng, loại bỏ sản phẩm đã chọn
            cart.products = cart.products.filter(item => !item.isSelected);
            await cart.save();
    
            res.status(201).json({ message: 'Order added successfully', order });
        } catch (err) {
            res.status(500).json({ message: 'Error adding order', error: err.message });
        }
    }
    
    
    async cancelOrders(req, res) {
        const orderId = req.params.id; 
        try {
            const order = await Order.findById(orderId);

            if (!orderId) {
                return res.status(400).json({ message: 'No products selected for cancel.' });
            }
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You are not authorized to cancel this order' });
            }
            if (['Shipped', 'Delivered'].includes(order.status)) {
                return res.status(400).json({ message: 'Cannot cancel an order that has been shipped or delivered' });
            }
            order.status = 'Cancelled';
            await order.save();
            res.status(200).json({ message: 'Order canceled successfully', order });
        } catch (err) {
            res.status(500).json({ message: 'Error cancel order', error: err.message });
        }
    }
    async updateStatus(req, res) {
        const orderId = req.params.id; 
        const { status } = req.body;
        try {
            const order = await Order.findById(orderId);
            if (!orderId) {
                return res.status(400).json({ message: 'No products selected for update' });
            }
            const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            order.status = status;
            await order.save();
            res.status(200).json({ message: 'Order status updated successfully', order });
        } catch (err) {
            res.status(500).json({ message: 'Error updating order status', error: err.message });
        }
    }
    // Get details of a specific order
    async getOrderById(req, res) {
        const { orderId } = req.params.id; 
        try {
            const order = await Order.findById(orderId).populate('products.product');
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching order', error: err.message });
        }
    }
}
module.exports = new OrderController();