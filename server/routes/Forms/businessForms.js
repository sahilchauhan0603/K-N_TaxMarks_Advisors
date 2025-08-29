const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BusinessAdvisory = require('../../models/BusinessAdvisory');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/business'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Startup & MSME Registration
router.post('/business-startup', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, businessName, businessType, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new BusinessAdvisory({
      name,
      email,
      mobile,
      businessName,
      businessType,
      notes,
      documentPath,
      advisoryType: 'startup',
    });
    await filing.save();
    res.json({ success: true, message: 'Startup & MSME Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Company Incorporation
router.post('/business-incorporation', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, companyName, companyType, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new BusinessAdvisory({
      name,
      email,
      mobile,
      companyName,
      companyType,
      notes,
      documentPath,
      advisoryType: 'incorporation',
    });
    await filing.save();
    res.json({ success: true, message: 'Company Incorporation request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal & Financial Advisory
router.post('/business-advisory', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, query, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const filing = new BusinessAdvisory({
      name,
      email,
      mobile,
      query,
      notes,
      documentPath,
      advisoryType: 'advisory',
    });
    await filing.save();
    res.json({ success: true, message: 'Legal & Financial Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Startup & MSME Registration requests
router.get('/business-startup/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'startup' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Company Incorporation requests
router.get('/business-incorporation/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'incorporation' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal & Financial Advisory requests
router.get('/business-advisory/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'advisory' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
