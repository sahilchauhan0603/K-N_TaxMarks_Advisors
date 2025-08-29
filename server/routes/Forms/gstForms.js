const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { GSTFiling, GSTReturnFiling, GSTResolution } = require('../../models/GST');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/gst'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// GST Filing
router.post('/gst-filing', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, gstNumber, filingType, businessName, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const filing = new GSTFiling({ name, email, mobile, gstNumber, filingType, businessName, notes, documents });
    await filing.save();
    res.json({ success: true, message: 'GST Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-filing/all', async (req, res) => {
  try {
    const allEntries = await GSTFiling.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Return Filing
router.post('/gst-return-filing', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, gstin, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new GSTReturnFiling({ name, email, mobile, gstin, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/gst-return-filing/all', async (req, res) => {
  try {
    const allEntries = await GSTReturnFiling.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Resolution
router.post('/gst-resolution', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, gstNumber, issue, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new GSTResolution({ name, email, mobile, gstNumber, issue, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/gst-resolution/all', async (req, res) => {
  try {
    const allEntries = await GSTResolution.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
