const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  isActive: { type: Boolean, default: true },
  // The current valid code for the rotating QR
  currentQRParams: { 
    code: { type: String }, 
    generatedAt: { type: Date } 
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);