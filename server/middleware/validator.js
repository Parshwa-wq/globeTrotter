const { validationResult } = require('express-validator');

// Middleware to catch validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 Bad Request with the first error message
        return res.status(400).json({ 
            success: false, 
            message: errors.array()[0].msg,
            errors: errors.array() 
        });
    }
    next();
};

module.exports = validateRequest;
