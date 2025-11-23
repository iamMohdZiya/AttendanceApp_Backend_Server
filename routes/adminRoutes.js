const express = require('express');
const router = express.Router();
const { 
  getStats, 
  addRoom, 
  getAllRooms, 
  addCourse, 
  getAllCourses,
  getAllUsers,
  getAttendanceReport
} = require('../controllers/adminController');

// Middleware to ensure user is logged in AND is an Admin
const { protect } = require('../middleware/authMiddleware');

// Custom middleware for Admin check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

router.use(protect); // All routes below require login
router.use(adminOnly); // All routes below require Admin role

router.get('/stats', getStats);
router.post('/rooms', addRoom);
router.get('/rooms', getAllRooms);
router.post('/courses', addCourse);
router.get('/courses', getAllCourses);
router.get('/users', getAllUsers);
router.get('/report', getAttendanceReport);


module.exports = router;