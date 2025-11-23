const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // NEW: Store Dynamic Location instead of Room ID
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius: { type: Number, default: 100 } // Default 100 meters
  },

  isActive: { type: Boolean, default: true },
  currentQRParams: { 
    code: { type: String }, 
    generatedAt: { type: Date } 
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);