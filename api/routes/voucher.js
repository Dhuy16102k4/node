const router = require('express').Router();
const voucherController = require('../app/controllers/voucherController');
const authenticateToken = require('../middlerware/authToken');

// Route để lấy danh sách người dùng với phân trang và sắp xếp theo số lượng đơn hàng

router.get('/',  voucherController.displayVouchers);
router.post('/add',  voucherController.addVoucher);
router.delete('/:id',voucherController.delete)



module.exports = router;
