// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
  senderPseudonym: { type: String, required: true },
  senderColor: { type: String, required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
