// models/user.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    username: { type: String, required: true, unique: true },
      wallet: {
    blogsWritten: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    badge: { type: String, default: 'New Contributor' }
  },
    role: { type: String, enum: ['student', 'therapist'], required: true }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
