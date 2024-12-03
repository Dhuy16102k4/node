const router = require('express').Router();
const cartController = require('../app/controllers/cartController');
const authenticateToken = require('../middlerware/authToken');


router.delete('/remove/:id',authenticateToken,cartController.removeCart);
router.post('/add',authenticateToken,cartController.addCart);
router.put('/selected', authenticateToken, cartController.selectItems);

router.get('/',authenticateToken,cartController.getCart);
module.exports = router;