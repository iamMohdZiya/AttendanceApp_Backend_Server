const express = require('express');
const router = express.Router();
const { markAttendance, getStudentHistory, getSessionAttendance, getFacultyReport } = require('../controllers/attendanceController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');

// All these routes need the user to be logged in
router.post('/mark', protect, markAttendance);
router.get('/history', protect, getStudentHistory);
router.get('/session/:sessionId', protect, facultyOnly, getSessionAttendance);
router.get('/faculty-report', protect, facultyOnly, getFacultyReport);

module.exports = router;