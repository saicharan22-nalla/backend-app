const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

// Admin signup
const signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function(err) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: 'Username already exists'
                    });
                }
                
                const token = jwt.sign(
                    { id: this.lastID, username },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                
                res.status(201).json({
                    success: true,
                    data: {
                        id: this.lastID,
                        username,
                        token
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error during signup'
        });
    }
};

// Admin login
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Server error during login'
            });
        }
    });
};

// Get current user
const getCurrentUser = (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            username: req.user.username
        }
    });
};

module.exports = {
    signup,
    login,
    getCurrentUser
};