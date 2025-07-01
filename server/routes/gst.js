const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { GSTFiling } = require('../models/GSTFiling');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/gst'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/gst-filing', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, gstNumber, filingType, businessName, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new GSTFiling({
      name,
      email,
      mobile,
      gstNumber,
      filingType,
      businessName,
      notes,
      documentPath,
    });
    await filing.save();
    res.json({ success: true, message: 'GST Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
