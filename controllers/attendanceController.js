const Session = require('../models/Session');
const Room = require('../models/Room');
const Attendance = require('../models/Attendance');
const { getDistanceInMeters } = require('../utils/geoUtils');

// @desc    Mark Attendance (Student scans QR)
// @route   POST /api/attendance/mark
// @access  Student Only
exports.markAttendance = async (req, res) => {
  const { sessionId, scannedCode, location, accuracy } = req.body;
  const studentId = req.user.id; // From Auth Middleware

  try {
    // 1. Check if Session exists and is active
    const session = await Session.findById(sessionId).populate('room');
    if (!session || !session.isActive) {
      return res.status(400).json({ message: 'Session is inactive or invalid' });
    }

    // 2. Prevent Double Marking
    const alreadyMarked = await Attendance.findOne({ session: sessionId, student: studentId });
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }

    // 3. Validate QR Code (Must match the currently active rotation)
    // The document states QR changes every 30s [cite: 39]
    if (session.currentQRParams.code !== scannedCode) {
      return res.status(400).json({ 
        message: 'Invalid or Expired QR Code. Please scan again.' 
      });
    }

    // 4. Validate Location (Geofencing)
    const roomLat = session.room.location.coordinates[1];
    const roomLng = session.room.location.coordinates[0];
    const roomRadius = session.room.radius || 100; // Default 100m [cite: 138]

    const distance = getDistanceInMeters(
      location.lat, 
      location.lng, 
      roomLat, 
      roomLng
    );

    let status = 'Rejected';
    let confidenceScore = 100;

    // Logic defined in Source [47-57]
    if (distance <= roomRadius) {
      status = 'Present';
      confidenceScore = 100 - (distance / roomRadius) * 20; // Simple score calc
    } else if (distance <= roomRadius + 20 || accuracy > 50) {
      // If slightly outside or GPS accuracy is bad, mark as Pending [cite: 56]
      status = 'Pending'; 
      confidenceScore = 50;
    } else {
      status = 'Rejected';
      confidenceScore = 0;
    }

    // 5. Save Record
    const attendance = await Attendance.create({
      session: sessionId,
      student: studentId,
      status: status,
      locationVerified: status === 'Present',
      capturedLocation: location,
      confidenceScore: Math.round(confidenceScore)
    });

    res.status(201).json({
      success: true,
      status: status,
      distance: Math.round(distance) + 'm',
      message: status === 'Present' ? 'Attendance Marked Successfully' : 'Attendance marked as Pending/Rejected due to location.'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Student History
// @route   GET /api/attendance/history
exports.getStudentHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ student: req.user.id })
      .populate('session')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};