// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
/*
// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));*/
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});
/*
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
// ... at the end of server/server.js

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the app for Vercel
module.exports = app;