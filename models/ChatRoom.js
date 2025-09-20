// models/ChatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  roomType: { 
    type: String, 
    enum: ['1v1', 'group'], 
    required: true 
  },
  topicCategory: { 
    type: String, 
    required: true 
  },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  participantCount: { 
    type: Number, 
    default: 1 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
