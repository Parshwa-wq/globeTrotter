const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        // Verify token (Bearer token format)
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        // Add user payload (userId, role) to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
