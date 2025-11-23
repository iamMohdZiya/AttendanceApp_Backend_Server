const express = require('express');
const router = express.Router();
const { startSession, getRotatingQR , getMyCourses,getRoomsForFaculty , getActiveSessions, endSession} = require('../controllers/sessionController');
const { protect, facultyOnly } = require('../middleware/authMiddleware'); 

// Route: POST /api/session/start
// Description: Starts a new class session (Faculty only)
router.post('/start', protect, facultyOnly, startSession);

// Route: GET /api/session/:id/qr
// Description: Fetches the current rotating QR code (Faculty only)
router.get('/:id/qr', protect, facultyOnly, getRotatingQR);
router.get('/my-courses', protect, facultyOnly, getMyCourses);
router.get('/rooms', protect, facultyOnly, getRoomsForFaculty);
router.get('/active', protect, getActiveSessions); 
router.post('/end', protect, facultyOnly, endSession);

module.exports = router;