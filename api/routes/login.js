const express = require('express');
const router = express.Router();
const loginController = require('../app/controllers/loginControllers');
const authenticateToken = require('../middlerware/authToken');

router.get('/', authenticateToken, (req, res) => {
    res.status(200).json({ authenticated: true, name: req.user });
});

router.post('/submit', loginController.submit);

module.exports = router;
