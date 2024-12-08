
const jwt = require('jsonwebtoken');
// Admin Role Middleware
module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Validate token

        if (!decoded.role || decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied. Admins Only.' });
        }

        req.user = { _id: decoded.userId, username: decoded.username, email: decoded.email, role: decoded.role }; // Attach user info to req object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid or Expired Token.' });
    }
};
