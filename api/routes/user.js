const router = require('express').Router();
const userController = require('../app/controllers/userController');
const authenticateToken = require('../middlerware/authToken');

// Route để lấy danh sách người dùng với phân trang và sắp xếp theo số lượng đơn hàng

router.get('/', userController.displayAll);


router.get('/code', authenticateToken, userController.sendVerificationCode);

router.get('/detail/',authenticateToken, userController.userDetail);

router.put('/update', authenticateToken, userController.updateUser);

module.exports = router;
