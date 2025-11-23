const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['Present', 'Pending', 'Rejected'], 
    default: 'Pending' 
  }, // [cite: 100]
  locationVerified: { type: Boolean, default: false },
  capturedLocation: {
    lat: Number,
    lng: Number
  },
  confidenceScore: { type: Number }, // [cite: 226]
  checkInTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);