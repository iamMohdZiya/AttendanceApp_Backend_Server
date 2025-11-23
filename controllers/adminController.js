const User = require('../models/User');
const Room = require('../models/Room');
const Course = require('../models/Course');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalRooms = await Room.countDocuments();
    const activeSessions = await Session.countDocuments({ isActive: true });

    res.json({
      students: totalStudents,
      faculty: totalFaculty,
      rooms: totalRooms,
      activeSessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// @desc    Add a New Room
// @route   POST /api/admin/rooms
exports.addRoom = async (req, res) => {
  const { roomCode, building, lat, lng, radius } = req.body;
  
  try {
    const room = await Room.create({
      roomCode,
      building,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON expects [longitude, latitude]
      },
      radius: radius || 100
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

// @desc    Get All Rooms
// @route   GET /api/admin/rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

// @desc    Add a Course
// @route   POST /api/admin/courses
exports.addCourse = async (req, res) => {
  const { courseCode, name, department, facultyId } = req.body;

  try {
    const course = await Course.create({
      courseCode,
      name,
      department,
      faculty: facultyId // Must be a valid User ObjectId
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

// @desc    Get All Courses
// @route   GET /api/admin/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};


// ... existing imports
// ... existing functions

// @desc    Get All Users (Faculty & Students)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users but exclude passwords for security
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};