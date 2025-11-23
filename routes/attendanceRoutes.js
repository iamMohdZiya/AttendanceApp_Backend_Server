const express = require('express');
const router = express.Router();
const { markAttendance, getStudentHistory } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// All these routes need the user to be logged in
router.post('/mark', protect, markAttendance);
router.get('/history', protect, getStudentHistory);

module.exports = router;