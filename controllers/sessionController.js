const Session = require('../models/Session');
const crypto = require('crypto'); // Built-in Node module for random strings

// @desc    Start a new Class Session
// @route   POST /api/session/start
// @access  Faculty Only
exports.startSession = async (req, res) => {
  const { courseId, roomId } = req.body;
  const facultyId = req.user.id; // Comes from authMiddleware

  try {
    // 1. Generate initial QR Code
    const initialCode = crypto.randomBytes(4).toString('hex'); // Random 8-char string

    // 2. Create Session in DB
    const session = await Session.create({
      course: courseId,
      faculty: facultyId,
      room: roomId,
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