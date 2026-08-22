const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const adminRouter = express.Router();

// Admin Middleware Check
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access denied' });
    }
};

adminRouter.get('/stats', authMiddleware, adminCheck, adminController.getStats);
adminRouter.get('/users', authMiddleware, adminCheck, adminController.getUsers);
adminRouter.delete('/users/:id', authMiddleware, adminCheck, adminController.deleteUser);
adminRouter.put('/users/:id/role', authMiddleware, adminCheck, adminController.updateUserRole);

module.exports = adminRouter;
