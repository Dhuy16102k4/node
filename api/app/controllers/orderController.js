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
        const { address, paymentMethod } = req.body;
        try {
            const cart = await findUserCart(req.user._id);
            if (!cart) {
                return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
            }
            //loc các sản phẩm đã chọn
            const selectedProducts = cart.products.filter(item => item.isSelected)
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
                paymentMethod,
                status: 'Pending',
            });
            await order.save();
            cart.products = cart.products.filter(item => !item.isSelected);
            await cart.save();

            res.status(201).json({ message: 'Order add successfully', order });
        } catch (err) {
            res.status(500).json({ message: 'Error add order', error: err.message });
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