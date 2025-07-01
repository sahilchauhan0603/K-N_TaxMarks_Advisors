const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Trademark = require('../models/Trademark');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/trademark'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/trademark', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, serviceType, brandName, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const trademark = new Trademark({
      name,
      email,
      mobile,
      serviceType,
      brandName,
      notes,
      documentPath,
    });
    await trademark.save();
    res.json({ success: true, message: 'Trademark request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
