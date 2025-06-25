const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

const allowedAdmins = [
  'sahilchauhan0603@gmail.com',
  'sahilpersonal2003@gmail.com',
  'saritachauhan0704@gmail.com',
];

const OTP_STORE = {};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!allowedAdmins.includes(email)) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  OTP_STORE[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  // Send OTP via email
  // TODO: Use your mailer config
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Admin OTP',
    text: `Your OTP is: ${otp}`,
  });
  res.json({ message: 'OTP sent' });
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = OTP_STORE[email];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }
  delete OTP_STORE[email];
  const token = jwt.sign({ email, admin: true }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
