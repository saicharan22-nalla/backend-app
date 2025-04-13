const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register admin user
// @access  Public
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Login admin user
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;