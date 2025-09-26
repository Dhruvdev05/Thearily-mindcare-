const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issues: {
    type: [String], // array of 3 issues
    validate: [arr => arr.length <= 3, 'Max 3 issues allowed']
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
