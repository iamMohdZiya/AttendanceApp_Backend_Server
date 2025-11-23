const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true }, // e.g., "CS101"
  name: { type: String, required: true },
  department: { type: String },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Assigned faculty [cite: 79]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);