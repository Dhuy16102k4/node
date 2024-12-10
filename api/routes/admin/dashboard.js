
const express = require('express');
const router = express.Router();
const  dashboard = require('../../app/controllers/dashboardController');
const authenticateToken = require('../../middlerware/adminToken');



router.get('/',dashboard.getDashboardStats);

module.exports = router;
