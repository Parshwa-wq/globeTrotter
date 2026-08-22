const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Fix: Use express.Router()
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
});
authRouter.delete('/me', authMiddleware, authController.deleteUser);

module.exports = authRouter;
