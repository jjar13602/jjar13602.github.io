require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server is running!' });
});

// Auth routes
app.use('/api/auth', require('./auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});