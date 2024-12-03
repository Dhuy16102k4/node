
const express = require('express');
const router = express.Router();
const { upload, productRouter } = require('../../app/controllers/productController');



router.post('/add', upload.single('img'), productRouter.add);

router.put('/:id', upload.single('img'), productRouter.update);

router.delete('/:id', productRouter.delete);

router.get('/', productRouter.display);

module.exports = router;
