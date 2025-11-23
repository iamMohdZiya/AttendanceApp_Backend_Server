const Session = require('../models/Session');
const Room = require('../models/Room');
const Attendance = require('../models/Attendance');
const { getDistanceInMeters } = require('../utils/geoUtils');

// @desc    Mark Attendance (Student scans QR)
// @route   POST /api/attendance/mark
// @access  Student Only
// ... imports
const { getDistanceInMeters } = require('../utils/geoUtils');

exports.markAttendance = async (req, res) => {
  const { sessionId, scannedCode, location, accuracy } = req.body;
  const studentId = req.user.id;

  try {
    // 1. Get Session (No need to populate 'room' anymore)
    const session = await Session.findById(sessionId);
    
    if (!session || !session.isActive) {
      return res.status(400).json({ message: 'Session is inactive' });
    }

    // ... (Keep the Double Marking Check) ...
    // ... (Keep the QR Code Validation) ...

    // 4. Validate Location (Dynamic Check)
    // Use the lat/lng stored in the SESSION document
    const classLat = session.location.lat;
    const classLng = session.location.lng;
    const classRadius = session.location.radius;

    const distance = getDistanceInMeters(
      location.lat, 
      location.lng, 
      classLat, 
      classLng
    );

    // ... (Keep status logic: Present vs Pending vs Rejected) ...
    // Copy the rest of your logic from the previous version here
    
    // Quick refresher on the status logic:
    let status = 'Rejected';
    let confidenceScore = 0;

    if (distance <= classRadius) {
      status = 'Present';
      confidenceScore = 100 - (distance / classRadius) * 20;
    } else if (distance <= classRadius + 20) {
      status = 'Pending';
      confidenceScore = 50;
    }

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
      message: status === 'Present' ? 'Attendance Marked' : 'Marked as Pending (Location issue)'
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

// @desc    Get Attendance for a specific Session (Live Roster)
// @route   GET /api/attendance/session/:sessionId
exports.getSessionAttendance = async (req, res) => {
  try {
    const attendanceList = await Attendance.find({ session: req.params.sessionId })
      .populate('student', 'name rollNo email') // Get student details
      .sort({ createdAt: -1 }); // Newest first

    res.json(attendanceList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roster' });
  }
};