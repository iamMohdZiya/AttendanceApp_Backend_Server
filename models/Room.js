const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true }, // e.g., "301"
  building: { type: String }, // e.g., "Main Block"
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude] - GeoJSON format
  },
  radius: { type: Number, default: 100 } // Geofence radius in meters [cite: 21]
}, { timestamps: true });

// Create a geospatial index for fast location queries
roomSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Room', roomSchema);