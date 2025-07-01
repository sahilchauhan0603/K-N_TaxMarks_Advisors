const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ITRFiling = require('../models/ITRFiling'); // Fixed import
// const { ensureAuth } = require('../middleware/adminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth'); // Ensure this is the correct path

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/itr'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/itr-filing
router.post('/itr-filing', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, pan, itrType, annualIncome, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new ITRFiling({
      name,
      email,
      mobile,
      pan,
      itrType,
      annualIncome,
      notes,
      documentPath,
    });
    await filing.save();
    res.json({ success: true, message: 'ITR Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
