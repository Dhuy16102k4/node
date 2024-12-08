const router = require('express').Router();
const userController = require('../app/controllers/userController');
const authenticateToken = require('../middlerware/authToken');

// Route để lấy danh sách người dùng với phân trang và sắp xếp theo số lượng đơn hàng

router.get('/', userController.displayAll);


router.post('/code', userController.sendVerificationCode);


router.put('/update', authenticateToken, userController.updateUser);

module.exports = router;
