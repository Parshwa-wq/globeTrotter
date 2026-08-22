const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const validateRequest = require('../middleware/validator');
const { registerRules, loginRules } = require('../validations/rules');

// Fix: Use express.Router()
const authRouter = express.Router();

authRouter.post('/register', registerRules, validateRequest, authController.register);
authRouter.post('/login', loginRules, validateRequest, authController.login);
authRouter.get('/me', authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = authRouter;
