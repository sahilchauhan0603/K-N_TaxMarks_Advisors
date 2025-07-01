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

// Dashboard stats endpoint
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GSTReturnFiling = require('../models/GSTReturnFiling');
    const GSTResolution = require('../models/GSTResolution');
    const { ITRFiling } = require('../models/ITRFiling');
    const ITRDocumentPrep = require('../models/ITRDocumentPrep');
    const ITRRefundNotice = require('../models/ITRRefundNotice');

    // Users
    const users = await User.find().select('-password');
    const total = users.length;
    const now = Date.now();
    const active = users.filter(u => now - new Date(u.createdAt).getTime() < 30*24*60*60*1000).length;
    const inactive = total - active;
    const recentUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Monthly stats (last 6 months)
    const monthly = Array(6).fill(0).map((_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5-i));
      const m = month.getMonth(), y = month.getFullYear();
      return {
        name: month.toLocaleString('default', { month: 'short' }),
        Users: users.filter(u => {
          const d = new Date(u.createdAt);
          return d.getMonth() === m && d.getFullYear() === y;
        }).length,
        Revenue: 0 // Placeholder, see below
      };
    });

    // Service counts
    const gst = await GSTReturnFiling.countDocuments() + await GSTResolution.countDocuments();
    const trademark = await Trademark.countDocuments();
    const tax = await TaxPlanning.countDocuments();
    const business = await BusinessAdvisory.countDocuments();
    const itr = await ITRFiling.countDocuments() + await ITRDocumentPrep.countDocuments() + await ITRRefundNotice.countDocuments();
    const other = 0;

    // Revenue (if you have a field, sum it; else, keep as 0 or estimate)
    let revenue = 0;
    // If you have a revenue field in any model, sum it here

    // Fill monthly revenue if you have per-user or per-service revenue
    // For now, keep as 0

    res.json({
      total,
      active,
      inactive,
      monthly,
      revenue,
      services: { gst, trademark, tax, business, itr, other },
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
});

module.exports = router;
