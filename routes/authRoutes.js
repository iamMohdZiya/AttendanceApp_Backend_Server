const express = require('express');
const router = express.Router();
const { registerUser, loginUser,updateUserProfile,registerBulkUsers } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.post('/register-bulk', protect, registerBulkUsers);

module.exports = router;