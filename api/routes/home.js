const router = require('express').Router();
const homeController = require('../app/controllers/homeController');
const authenticateToken = require('../middlerware/authToken');



//coment
router.post('/detail/:id',authenticateToken,homeController.addComment);

router.get('/detail/:id',homeController.productDetail);

router.get('/menu',homeController.menuDisplay);

router.get('/',homeController.display);

module.exports = router;