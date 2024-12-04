const router = require('express').Router();
const cartController = require('../app/controllers/cartController');
const authenticateToken = require('../middlerware/authToken');

// Route to add products to the cart
router.post('/add', authenticateToken, cartController.addCart);

// Route to update product selection (optional)
router.put('/selected', authenticateToken, cartController.selectItems);

// Route to handle removing or updating products in the cart (decrement or remove)
router.post('/remove', authenticateToken, cartController.removeCart); // Changed to POST from DELETE

// Route to get the user's cart
router.get('/', authenticateToken, cartController.getCart);

module.exports = router;
