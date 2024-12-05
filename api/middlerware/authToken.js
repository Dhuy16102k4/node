// const jwt = require('jsonwebtoken');

// // Middleware to validate the access token
// module.exports = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
//     if (!token) {
//         return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY); // Validate access token
//         req.user = { _id: decoded.userId, username: decoded.username }; // Attach user details to req
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid or Expired Token.' });
//     }
// };
const jwt = require('jsonwebtoken');

// Middleware to validate the access token
module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];// Extract token from header

    console.log('Received Token:', token);  // This will print the token (or undefined if it's missing)

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Validate token
        if (!decoded.userId || !decoded.username || !decoded.email) {
            return res.status(401).json({ message: 'Invalid token structure.' });
        }
        req.user = { _id: decoded.userId, username: decoded.username, email: decoded.email }; // Attach user info to req object
        console.log('Decoded User Info:', req.user);
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Token Verification Error:', err); // Log the error for debugging
        res.status(401).json({ message: 'Invalid or Expired Token.' });
    }
};


