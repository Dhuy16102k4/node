const User = require('../models/users');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'huyd37448@gmail.com',
        pass: 'dwxr hpop lkke ekto'
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

async function sendResetPasswordEmail(userEmail, resetCode) {
    const mailOptions = {
        from: 'huyd37448@gmail.com',
        to: userEmail,
        subject: 'Reset password code',
        text: `Your reset password code is: ${resetCode}. Code expire in 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email reset mật khẩu đã được gửi.');
    } catch (error) {
        console.error('Lỗi gửi email reset mật khẩu: ', error);
    }
}

class RegisterController {
    async submit(req, res, next) {
        const { username, email, password, confirm_password , phone , address } = req.body;
        if (!username || !email || !password || !confirm_password|| !phone || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must contain at least 6 characters' });
        }
        User.findOne({ $or: [{ username }, { email }] })
            .then(existsUser => {
                if (existsUser) {
                    return res.status(409).json({ error: 'Username or email already exists' });
                } const newUser = new User({ username, email, password, phone , address });

                return newUser.save();
            })
            .then(() => {
                res.status(201).json({ message: 'User registered successfully' });
            })
            .catch(error => {
                console.error('Error during registration:', error);
                next(error);
            });
        }

    async sendResetPasswordCode(req, res) {
        const { email } = req.body;
    
        try {

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
            }
    
            // Tạo mã reset mật khẩu
            const resetCode = crypto.randomBytes(3).toString('hex'); // 6 ký tự ngẫu nhiên
    
            // Lưu mã reset vào database (có thêm thời gian hết hạn)
            user.verificationCode = resetCode;
            user.verificationCodeExpires = Date.now() + 600000; // Mã hết hạn sau 10 phút
            await user.save();
    
            // Gửi email với mã reset mật khẩu
            await sendResetPasswordEmail(email, resetCode);
    
            res.status(200).json({ message: 'Mã xác nhận đặt lại mật khẩu đã được gửi qua email.' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi gửi mã xác nhận đặt lại mật khẩu', error: err.message });
        }
    }
    
    async resetPassword(req, res) {
        const { email, newPassword, resetCode } = req.body;

        try {
            // Kiểm tra người dùng tồn tại
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
            }

            // Kiểm tra mã reset mật khẩu
            if (user.verificationCode !== resetCode || user.verificationCodeExpires < Date.now()) {
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn.' });
            }

            // Cập nhật mật khẩu mới
            //await bcrypt.hash(newPassword, 10);
            user.password = newPassword;
            user.verificationCode = undefined; // Xóa mã reset sau khi sử dụng
            user.verificationCodeExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu', error: err.message });
        }
    }
}
    
module.exports = new RegisterController();
