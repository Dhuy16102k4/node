const nodemailer = require('nodemailer');
const Order = require('../models/orders');
const Cart = require('../models/carts');
const User = require('../models/users');
const mongoose = require('mongoose');
// Tạo transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'huyd37448@gmail.com', // Email của bạn
        pass: 'dwxr hpop lkke ekto' // Mật khẩu ứng dụng (nếu bật 2FA) hoặc mật khẩu tài khoản (nếu không bật 2FA)
    }
});

// Hàm gửi email
async function sendEmail(userEmail, subject, message) {
    const mailOptions = {
        from: 'huyd37448@gmail.com',
        to: userEmail,
        subject: subject, // Tiêu đề email
        text: message // Nội dung email
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

// Nội dung email theo trạng thái
const emailContent = {
    Pending: (orderId) => `Đơn hàng ID ${orderId} đã được đặt thành công và đang chờ xác nhận.`,
    Confirmed: (orderId) => `Đơn hàng ID ${orderId} đã được xác nhận. Chúng tôi sẽ sớm xử lý và giao hàng.`,
    Shipped: (orderId) => `Đơn hàng ID ${orderId} đã được vận chuyển. Xin vui lòng chờ đợi.`,
    Delivered: (orderId) => `Đơn hàng ID ${orderId} đã được giao thành công. Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.`,
    Cancelled: (orderId) => `Đơn hàng ID ${orderId} đã bị hủy. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.`
};

async function findUserCart(userId) {
    return await Cart.findOne({ user: userId }).populate('products.product');
}

async function findUserOrders(userId) {
    return await Order.find({ user: userId });
}
function validateEmail(email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
}
class OrderController {
    // Phương thức thêm đơn hàng
    async add(req, res) {
        const { address, paymentMethod, phone ,email} = req.body;
        try {
            const cart = await findUserCart(req.user._id);
           
            if (!cart) {
                return res.status(400).json({ message: 'Giỏ hàng trống. Không thể đặt đơn hàng.' });
            }

            const selectedProducts = cart.products.filter(item => item.isSelected);
            if (selectedProducts.length === 0) {
                return res.status(400).json({ message: 'Không có sản phẩm nào được chọn.' });
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
                email,
                totalPrice,
                address,
                phone,
                paymentMethod,
                status: 'Pending',
            });

            await order.save();
            
            selectedProducts.forEach(item => {
                const product = item.product;
                const quantityOrdered = item.quantity;
    
                if (product.stock < quantityOrdered) {
                    return res.status(400).json({ message: `Không đủ số lượng của sản phẩm: ${product.name}` });
                }
    
                product.stock -= quantityOrdered;
                product.save();  // Save the updated stock
            });
            cart.products = cart.products.filter(item => !item.isSelected);
            
            await cart.save();

            // Gửi email thông báo đặt hàng thành công
            await sendEmail(email, 'Đặt hàng thành công', emailContent.Pending(order._id));

            res.status(201).json({ message: 'Đơn hàng đã được đặt thành công', order });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi đặt đơn hàng', error: err.message });
        }
    }

    // Phương thức hủy đơn hàng
    async cancelOrders(req, res) {
        const orderId = req.params.id;
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(400).json({ message: 'Không tìm thấy đơn hàng để hủy.' });
            }
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
            }
            if (['Shipped', 'Delivered'].includes(order.status)) {
                return res.status(400).json({ message: 'Không thể hủy đơn hàng đã được giao hoặc vận chuyển' });
            }

            order.status = 'Cancelled';
            await order.save();

            // Gửi email thông báo hủy đơn hàng
            await sendEmail(req.user.email, 'Đơn hàng đã bị hủy', emailContent.Cancelled(order._id));

            res.status(200).json({ message: 'Đơn hàng đã bị hủy', order });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi hủy đơn hàng', error: err.message });
        }
    }

    
    // Phương thức hiển thị tất cả đơn hàng của người dùng
    
    //user display
    async display(req, res) {
        try {
            const orders = await findUserOrders(req.user._id);
            if (!orders) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào' });
            }
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn hàng', error: err.message });
        }
    }
    async adminDisplay(req, res) {
        const status = req.query.status || ''; 
        const page = parseInt(req.query.page) || 1; 
        const orderPerPage = parseInt(req.query.limit) || 3; 
    
    
        if (page <= 0 || orderPerPage <= 0) {
            return res.status(400).json({ message: 'Invalid pagination parameters.' });
        }
    
        try {
            // điều kiện lọc
            let filter = {};
            if (status) {
                filter.status = status; 
            }
            
            const [orders, totalOrders] = await Promise.all([
                Order.find(filter)
                    .populate('user', 'username') 
                    .populate('status') 
                    .skip((page - 1) * orderPerPage) 
                    .limit(orderPerPage) 
                    .lean(), 
                Order.countDocuments(filter) 
            ]);
    
            const totalPages = Math.ceil(totalOrders / orderPerPage);
    
        
            if (page > totalPages) {
                return res.status(400).json({ message: 'Page exceeds total pages.' });
            }
          
            
            
        
            res.status(200).json({
                orders, 

                totalPages, 
                currentPage: page, 
                limit: orderPerPage 
            });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn hàng', error: err.message });
        }
    }
    // Phương thức cập nhật trạng thái đơn hàng
   async updateStatus(req, res) {
    const orderId = req.params.id;
    
    const { status, email, phone } = req.body; // Chỉ lấy status, email và phone từ body (nếu cần)

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Không tìm thấy đơn hàng để cập nhật.' });
        }

        const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }

        // Cập nhật trạng thái đơn hàng mà không thay đổi các trường khác như email, phone
        order.status = status;

        // Nếu bạn muốn cập nhật email và phone khi có thay đổi
        if (email) order.email = email;
        if (phone) order.phone = phone;

        await order.save();
        console.log('Updated Order:', order);

        res.status(200).json({ message: `Trạng thái đơn hàng đã được cập nhật thành ${status}`, order });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng', error: err.message });
    }
}

    

    async deleteOrder(req, res) {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID không hợp lệ.' });
        }
    
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(400).json({ message: 'Không tìm thấy đơn hàng để xóa.' });
            }
           // const email = order.email;
          //  console.log(email);
            // Kiểm tra trạng thái đơn hàng, không thể xóa nếu đã được vận chuyển hoặc giao
            if (['Shipped', 'Delivered'].includes(order.status)) {
                return res.status(400).json({ message: 'Không thể xóa đơn hàng đã được vận chuyển hoặc giao.' });
            }
    
            // Xóa đơn hàng
            
            const deletedOrder = await Order.deleteOne({ _id: orderId });
            if (deletedOrder.deletedCount === 0) {
                return res.status(400).json({ message: 'Order not found or already deleted' });
            }
            // Kiểm tra nếu có email, và gửi email thông báo hủy đơn hàngsss
            if (order.email && validateEmail(order.email)) {
                try {
                    await sendEmail(order.email, 'Đơn hàng đã bị xóa', `Đơn hàng ID ${orderId} của bạn đã bị xóa.`);
                } catch (emailError) {
                    console.error('Error sending email to', order.email, emailError);
                }
            } else {
                console.error('Invalid or missing email for order:', orderId);
            }
            
            res.status(200).json({ message: 'Đơn hàng đã được xóa thành công.' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error: err.message });
        }
    }
    
   
    // Phương thức lấy chi tiết đơn hàng
    async getOrderById(req, res) {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId).populate('products.product');
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn hàng', error: err.message });
        }
    }
}

module.exports = new OrderController();
