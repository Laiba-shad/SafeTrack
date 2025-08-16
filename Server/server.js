/* eslint-env node */
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const todoRoutes = require('./routes/todoRoutes.js');

dotenv.config();

// DB connection
connectDB();

const app = express();
const HOST_IP = process.env.HOST_IP || 'localhost';
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors()); // enable CORS
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(morgan("dev"));

// Test route
app.get('/test', (req, res) => res.json({ success: true, message: 'API working' }));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1', todoRoutes);
app.use('/api/v1', require('./routes/userRoute'));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://${HOST_IP}:${PORT}`);
});
