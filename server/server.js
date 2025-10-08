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

// ----------------------------
// Middleware
// ----------------------------

// Allow requests from frontend URLs
const allowedOrigins = [
  'https://password-keeper-eight.vercel.app', // your deployed frontend
  'http://localhost:3000',                    // local development
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ----------------------------
// API Routes
// ----------------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));

// ----------------------------
// Test route
// ----------------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for serverless environments (Vercel)
module.exports = app;
