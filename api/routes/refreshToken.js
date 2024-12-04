const express = require('express');
const router = express.Router();
const { refreshToken } = require('../app/controllers/refreshTokenController'); // Import your refreshToken controller

// POST route to refresh the access token
router.post('/', refreshToken);

module.exports = router;
