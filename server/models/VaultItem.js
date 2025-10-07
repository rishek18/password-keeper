// server/models/VaultItem.js
const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
  // This creates a reference to the User model
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const VaultItem = mongoose.model('VaultItem', vaultItemSchema);
module.exports = VaultItem;