const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'faculty', 'student'], 
    required: true 
  },
  // Fields for Students
  rollNo: { type: String }, // [cite: 133]
  studentId: { type: String },
  // Fields for Faculty
  staffId: { type: String }, // [cite: 126]
  dept: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);