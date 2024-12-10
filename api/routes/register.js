const express = require('express');
const router = express.Router();

const registerRouter = require('../app/controllers/registerController');


router.post('/submit', registerRouter.submit);

router.post('/code', registerRouter.sendResetPasswordCode);

router.put('/reset', registerRouter.resetPassword);

module.exports = router;
