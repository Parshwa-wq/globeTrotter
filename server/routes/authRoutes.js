const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the routes and map them to the controller functions
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
