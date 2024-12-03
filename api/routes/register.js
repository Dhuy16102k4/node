const express = require('express');
const router = express.Router();

const registerRouter = require('../app/controllers/registerController');


router.post('/submit', registerRouter.submit);


module.exports = router;
