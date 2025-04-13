require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Revisit E-commerce Backend');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});