const express = require('express');
const router = express.Router();
const { markAttendance, getStudentHistory, getSessionAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// All these routes need the user to be logged in
router.post('/mark', protect, markAttendance);
router.get('/history', protect, getStudentHistory);
router.get('/session/:sessionId', protect, facultyOnly, getSessionAttendance);


module.exports = router;