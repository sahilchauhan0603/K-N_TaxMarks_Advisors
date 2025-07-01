const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const GSTResolution = require('../models/GSTResolution');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/gst-resolution'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, gstin, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new GSTResolution({ name, email, mobile, gstin, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
