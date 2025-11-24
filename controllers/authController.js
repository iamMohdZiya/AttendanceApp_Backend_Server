const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Mainly for initial Admin setup or manual addition)
// @route   POST /api/auth/register
// @access  Public (or Admin only in production)
exports.registerUser = async (req, res) => {
  const { name, email, password, role, rollNo, staffId, dept } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,      // 'admin', 'faculty', 'student'
      rollNo,    // Optional: for students
      staffId,   // Optional: for faculty
      dept       // Optional: for faculty/students
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Frontend uses this to redirect (Admin vs Student Dashboard)
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // Update allowed fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Only hash and update password if a new one is sent
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // DO NOT update dept, rollNo, staffId, or role here for security

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      dept: updatedUser.dept,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};