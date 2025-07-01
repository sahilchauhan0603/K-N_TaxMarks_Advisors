const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BusinessAdvisory = require('../models/BusinessAdvisory');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/business'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/business-advisory', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, advisoryType, businessName, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new BusinessAdvisory({
      name,
      email,
      mobile,
      advisoryType,
      businessName,
      notes,
      documentPath,
    });
    await filing.save();
    res.json({ success: true, message: 'Business Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
