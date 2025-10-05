const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { login, register, verifyOTP, sendOTP, forgotPassword, resetPassword, verifyToken } = require('../controllers/userController');
const { getUserByEmail, updateUserProfile } = require('../controllers/userController');

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

// Verify OTP route
router.post('/verify-otp', verifyOTP);

// Send OTP route
router.post('/send-otp', sendOTP);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Verify Token
router.get('/verify-token', verifyToken);

// Get user profile (protected route)
router.get('/user', getUserByEmail);

// Update user profile (protected route)
router.put('/user', updateUserProfile);

module.exports = router;
