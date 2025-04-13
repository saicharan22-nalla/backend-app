const jwt = require('jsonwebtoken');
const db = require('../models/database');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No token, authorization denied'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in database
        db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }
            
            // Add user to request object
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token is not valid'
        });
    }
};

// Admin role check middleware
const adminMiddleware = (req, res, next) => {
    // In a real app, you would check user role here
    // For this example, we'll just check if user is authenticated
    if (!req.user) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized access'
        });
    }
    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware
};