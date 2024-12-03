// categoryRouter.js
const express = require('express');
const router = express.Router();
const categoryController = require('../../app/controllers/categoryController');




router.post('/', categoryController.add);

router.put('/:id', categoryController.update);

router.delete('/:id', categoryController.delete);

router.get('/', categoryController.display);
module.exports = router;
