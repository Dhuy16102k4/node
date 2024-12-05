const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

// Ensure SECRET_KEY is set
if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
}

// Function to generate JWT (access or refresh token)
function generateToken(user){
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // expires in 24 hours
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { header });
}

function generateRefreshToken(user){
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // refresh token expires in 30 days
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { header });
}

class LoginController {
    // Handle user login
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
                const token = generateToken(user);
                const refreshToken = generateRefreshToken(user);
                return res.status(200).json({ message: 'Login successful', token, refreshToken });
            } else {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
    
    // Handle logout (optional, but good to add)
    async logout(req, res, next) {
        res.status(200).json({ message: 'Logout successful' });
    }
}

module.exports = new LoginController();
