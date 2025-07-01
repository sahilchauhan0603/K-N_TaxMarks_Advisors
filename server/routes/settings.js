const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// In-memory settings store (replace with DB in production)
let settings = {
  notifications: {
    email: true,
    sms: false,
    inApp: true
  },
  appearance: {
    theme: 'light',
    color: 'blue'
  }
};

// Get settings
router.get('/', adminAuth, (req, res) => {
  res.json(settings);
});

// Update settings
router.put('/', adminAuth, (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

module.exports = router;
