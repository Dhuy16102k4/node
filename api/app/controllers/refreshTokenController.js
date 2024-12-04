const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Assuming you have a User model

// Generate new access token from the refresh token
function generateAccessToken(user) {
    const payload = {
        userId: user._id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours expiry
    };
    return jwt.sign(payload, process.env.SECRET_KEY);
}

// Refresh Token Controller
async function refreshToken(req, res) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

        // Find the user in the database
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
}

module.exports = {
    refreshToken,
};
