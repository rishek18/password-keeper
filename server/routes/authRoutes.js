// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Utility to generate a token
const generateToken = (userId) => {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRATION_HOURS}h`,
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Please provide email and password' });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password, // Password will be hashed by the pre-save middleware
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, email: user.email },
      });
    } else {
      res.status(401).json({ detail: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Server error during login' });
  }
});

module.exports = router;