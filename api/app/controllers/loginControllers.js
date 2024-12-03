const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function generateToken(user){
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        userId: user._id,
        username: user.username,
        //email maybe
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { header });
}

class LoginController {
    // Đăng nhập người dùng
    async submit(req, res, next) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                console.log(process.env.SECRET_KEY);
                const token = generateToken(user);
                console.log(token);
                return res.status(200).json({ message: 'Login successful' , token});
            } else {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
    
    
    // Đăng xuất người dùng
    async logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    }
}

module.exports = new LoginController();
