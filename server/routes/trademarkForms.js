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

// Trademark Search & Registration
router.post('/trademark-search', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, brandName, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const trademark = new Trademark({
      name,
      email,
      mobile,
      brandName,
      notes,
      documentPath,
      serviceType: 'search',
    });
    await trademark.save();
    res.json({ success: true, message: 'Trademark Search & Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal Documentation & Compliance
router.post('/trademark-documentation', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, docType, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const trademark = new Trademark({
      name,
      email,
      mobile,
      docType,
      notes,
      documentPath,
      serviceType: 'documentation',
    });
    await trademark.save();
    res.json({ success: true, message: 'Legal Documentation & Compliance request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// IP Protection & Dispute Resolution
router.post('/trademark-protection', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, disputeType, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const trademark = new Trademark({
      name,
      email,
      mobile,
      disputeType,
      notes,
      documentPath,
      serviceType: 'protection',
    });
    await trademark.save();
    res.json({ success: true, message: 'IP Protection & Dispute Resolution request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Trademark Search & Registration requests
router.get('/trademark-search/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'search' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal Documentation & Compliance requests
router.get('/trademark-documentation/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'documentation' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all IP Protection & Dispute Resolution requests
router.get('/trademark-protection/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'protection' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
