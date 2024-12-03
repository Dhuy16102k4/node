const router = require('express').Router();
const homeController = require('../app/controllers/homeController');
const authenticateToken = require('../middlerware/authToken');



//coment
router.post('/detail/comment/:id',authenticateToken,homeController.addComment);

router.get('/detail/:id',authenticateToken,homeController.productDetail);

router.get('/',homeController.display);

module.exports = router;