const router = require('express').Router();
const ordertController = require('../app/controllers/orderController');
const authenticateToken = require('../middlerware/authToken');


// chi tiet order
router.get('/detail/:id',authenticateToken,ordertController.getOrderById);
//thanh toan
router.post('/submit',authenticateToken,ordertController.add);
//huy đơn hàng
router.put('/delete/:id',ordertController.cancelOrders);

//display
router.get('/',authenticateToken,ordertController.display);



//cap nhat trang thai don hang 
router.put('/:id',ordertController.updateStatus);

//xóa đơn hàng
router.delete('/:id',ordertController.deleteOrder)


//admin display
router.get('/admin/',ordertController.adminDisplay)


module.exports = router;