// server/routes/vaultRoutes.js
const express = require('express');
const router = express.Router();
const VaultItem = require('../models/VaultItem');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect);

// @route   GET /api/vault
// @desc    Get all vault items for the logged-in user
router.get('/', async (req, res) => {
  try {
    const items = await VaultItem.find({ user_id: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// @route   POST /api/vault
// @desc    Create a new vault item
router.post('/', async (req, res) => {
  const { title, username, password, url, notes } = req.body;
  try {
    const newItem = new VaultItem({
      user_id: req.userId,
      title,
      username,
      password,
      url,
      notes,
    });
    const item = await newItem.save();
    res.status(201).json({ message: 'Vault item created successfully', item });
  } catch (error) {
    res.status(400).json({ detail: 'Failed to create vault item' });
  }
});

// @route   PUT /api/vault/:id
// @desc    Update a vault item
router.put('/:id', async (req, res) => {
  try {
    let item = await VaultItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ detail: 'Vault item not found' });
    }
    // Ensure the item belongs to the user
    if (item.user_id.toString() !== req.userId) {
      return res.status(401).json({ detail: 'User not authorized' });
    }
    item = await VaultItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json({ message: 'Vault item updated successfully', item });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// @route   DELETE /api/vault/:id
// @desc    Delete a vault item
router.delete('/:id', async (req, res) => {
  try {
    let item = await VaultItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ detail: 'Vault item not found' });
    }
    // Ensure the item belongs to the user
    if (item.user_id.toString() !== req.userId) {
      return res.status(401).json({ detail: 'User not authorized' });
    }
    await VaultItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

module.exports = router;