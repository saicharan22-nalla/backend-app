const db = require('../models/database');

// Get all categories
const getAllCategories = (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: 'Failed to fetch categories' 
            });
        }
        res.json({
            success: true,
            data: rows
        });
    });
};

// Add new category
const addCategory = (req, res) => {
    const { name, item_count } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !item_count) {
        return res.status(400).json({
            success: false,
            error: 'Name and item count are required'
        });
    }

    db.run(
        'INSERT INTO categories (name, item_count, image_url) VALUES (?, ?, ?)',
        [name, item_count, image_url],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to add category'
                });
            }
            res.status(201).json({
                success: true,
                data: {
                    id: this.lastID,
                    name,
                    item_count,
                    image_url
                }
            });
        }
    );
};

// Update category
const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name, item_count } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    if (!name || !item_count) {
        return res.status(400).json({
            success: false,
            error: 'Name and item count are required'
        });
    }

    db.run(
        'UPDATE categories SET name = ?, item_count = ?, image_url = ? WHERE id = ?',
        [name, item_count, image_url, id],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update category'
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            res.json({
                success: true,
                data: {
                    id,
                    name,
                    item_count,
                    image_url
                }
            });
        }
    );
};

// Delete category
const deleteCategory = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM categories WHERE id = ?',
        [id],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete category'
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        }
    );
};

module.exports = {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
};