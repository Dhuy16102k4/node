const express = require('express');
const router = express.Router();
const loginController = require('../app/controllers/loginControllers'); // Ensure the path is correct
const authenticateToken = require('../middlerware/authToken');

// Route definitions
router.get('/check', authenticateToken, (req, res) => {
    res.status(200).json({ authenticated: true, name: req.user });
});

router.get('/logout', authenticateToken, loginController.logout);

// Ensure 'submit' function is defined and imported properly
router.post('/submit', loginController.submit);

router.post('/loginGoogle', loginController.loginGoogle)

module.exports = router;
