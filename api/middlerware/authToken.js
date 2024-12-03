const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);// Giải mã token
        req.user = { _id: decoded.userId, username: decoded.username }; // Lưu thông tin user từ token vào `req`
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token.' });
    }
};
