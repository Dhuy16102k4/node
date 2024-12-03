const router = require('express').Router();
const ordertController = require('../app/controllers/orderController');
const authenticateToken = require('../middlerware/authToken');


// chi tiet order
router.get('/detail/:id',authenticateToken,ordertController.getOrderById);
//thanh toan
router.post('/submit',authenticateToken,ordertController.add);
//huy thanh toan
router.put('/delete/:id',authenticateToken,ordertController.cancelOrders);
//cap nhat trang thai don hang 
router.put('/update/:id',authenticateToken,ordertController.updateStatus);
//display
router.get('/',authenticateToken,ordertController.display);
module.exports = router;