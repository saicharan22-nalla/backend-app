const express = require('express');
const router = express.Router();
const { 
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { authMiddleware } = require('../middleware/auth');

// Get all categories
router.get('/', authMiddleware, getAllCategories);

// Add new category
router.post('/', authMiddleware, addCategory);

// Update category
router.put('/:id', authMiddleware, updateCategory);

// Delete category
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;