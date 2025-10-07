// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request (excluding password)
      req.userId = decoded.user_id; // The payload in Python was {"user_id": ...}

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ detail: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ detail: 'Not authorized, no token' });
  }
};

module.exports = { protect };