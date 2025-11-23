const Session = require('../models/Session');
const crypto = require('crypto'); // Built-in Node module for random strings

// @desc    Start a new Class Session
// @route   POST /api/session/start
// @access  Faculty Only
// @desc    Start a new Class Session (Dynamic Location)
// @route   POST /api/session/start
exports.startSession = async (req, res) => {
  const { courseId, lat, lng } = req.body; // <-- Receiving Lat/Lng now
  const facultyId = req.user.id;

  try {
    const initialCode = require('crypto').randomBytes(4).toString('hex');

    const session = await Session.create({
      course: courseId,
      faculty: facultyId,
      location: {
        lat: lat,
        lng: lng,
        radius: 100 // We fix this to 100m as per your request
      },
      isActive: true,
      currentQRParams: {
        code: initialCode,
        generatedAt: Date.now()
      }
    });

    res.status(201).json({ 
      success: true, 
      sessionId: session._id,
      qrCode: initialCode 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error: error.message });
  }
};
// ... (keep the other functions like getRotatingQR, etc.)

// @desc    Get/Refresh QR Code (Called every 30s by Faculty App)
// @route   GET /api/session/:id/qr
// @access  Faculty Only
exports.getRotatingQR = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session || !session.isActive) {
      return res.status(404).json({ message: 'Session not active' });
    }

    // Generate NEW Code
    const newCode = crypto.randomBytes(4).toString('hex');
    
    // Update DB
    session.currentQRParams = {
      code: newCode,
      generatedAt: Date.now()
    };
    await session.save();

    res.json({ code: newCode });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing QR', error: error.message });
  }
};

// ... existing imports
const Course = require('../models/Course'); // <-- Import Course model

// ... existing startSession and getRotatingQR functions ...

// @desc    Get Courses for the Logged-in Faculty
// @route   GET /api/session/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const Room = require('../models/Room'); // <--- Ensure you import the Room model at the top

// ... existing imports and functions ...

// @desc    Get All Rooms (For Faculty to select)
// @route   GET /api/session/rooms
exports.getRoomsForFaculty = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};


// @desc    Get All Active Sessions (For Student Dashboard)
// @route   GET /api/session/active
exports.getActiveSessions = async (req, res) => {
  try {
    // Find sessions where isActive is true, and populate Course/Faculty names
    const sessions = await Session.find({ isActive: true })
      .populate('course', 'name courseCode')
      .populate('faculty', 'name');
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};