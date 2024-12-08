const nodemailer = require('nodemailer');
const User = require('../models/users');
const Order = require('../models/orders');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Tạo transporter cho email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'huyd37448@gmail.com', // Địa chỉ email của bạn
        pass: 'dwxr hpop lkke ekto' // Mật khẩu ứng dụng
    }
});

// Hàm gửi email với mã xác nhận
async function sendVerificationEmail(userEmail, verificationCode) {
    const mailOptions = {
        from: 'huyd37448@gmail.com',
        to: userEmail,
        subject: 'Mã xác nhận cập nhật thông tin',
        text: `Mã xác nhận của bạn là: ${verificationCode}. Mã này sẽ hết hạn trong 10 phút.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email xác nhận đã được gửi.');
    } catch (error) {
        console.error('Lỗi gửi email xác nhận: ', error);
    }
}

class UserController {
    // Phương thức gửi email xác nhận cho việc cập nhật thông tin người dùng
    async sendVerificationCode(req, res) {
        const { email } = req.body;
        try {
            // Kiểm tra xem email có tồn tại trong hệ thống không
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
            }
    
            // Tạo mã xác nhận ngẫu nhiên
            const verificationCode = crypto.randomBytes(3).toString('hex'); // 6 ký tự ngẫu nhiên
    
            // Lưu mã xác nhận vào database (có thể thêm thời gian hết hạn)
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = Date.now() + 600000; // Mã hết hạn sau 10 phút
            await user.save();
    
            // Gửi email với mã xác nhận
            await sendVerificationEmail(email, verificationCode);
    
            res.status(200).json({ message: 'Mã xác nhận đã được gửi qua email.' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi gửi mã xác nhận', error: err.message });
        }
    }
    
     // Phương thức cập nhật thông tin người dùng
     async updateUser(req, res) {
        const { userId } = req.params;
        const { username, email, password, phone, verificationCode } = req.body;
    
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
    
            // Kiểm tra mã xác nhận
            if (user.verificationCode !== verificationCode || user.verificationCodeExpires < Date.now()) {
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn.' });
            }
    
            // Cập nhật thông tin người dùng (nếu có thay đổi)
            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = await bcrypt.hash(password, 10);
            if (phone) user.phone = phone;
    
            user.verificationCode = undefined; // Xóa mã xác nhận sau khi cập nhật thành công
    
            await user.save();
    
            res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công', user });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error: err.message });
        }
    }
    

    // admin
    async displayAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query; // Mặc định page = 1 và limit = 10

            // Tính toán số lượng dữ liệu cần bỏ qua (skip) và số lượng dữ liệu cần lấy (limit)
            const skip = (page - 1) * limit;
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'orders', // Lấy thông tin từ collection 'orders'
                        localField: '_id',
                        foreignField: 'user',
                        as: 'orders'
                    }
                },
                {
                    $project: {
                        username: 1,
                        email: 1,
                        orderCount: { $size: '$orders' }, // Tính số lượng đơn hàng
                        orders: 1
                    }
                },
                {
                    $sort: { orderCount: -1 } // Sắp xếp theo số lượng đơn hàng giảm dần
                },
                {
                    $skip: skip // Bỏ qua số lượng người dùng đã qua
                },
                {
                    $limit: parseInt(limit) // Giới hạn số lượng người dùng trên mỗi trang
                }
            ]);

            // Lấy tổng số người dùng để tính số trang
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalUsers: totalUsers,
                users: users
            });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: err.message });
        }
    }

   
}

module.exports = new UserController();
