const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BusinessAdvisory = require('../../models/BusinessAdvisory');
const auth = require('../../middleware/userAuth');

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
router.post('/business-startup', auth, upload.single('documents'), async (req, res) => {
  try {
    const { businessName, businessType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      businessName,
      businessType,
      notes,
      documentPath,
      advisoryType: 'startup',
    });
    await businessService.save();
    res.json({ success: true, message: 'Startup & MSME Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Company Incorporation
router.post('/business-incorporation', auth, upload.single('documents'), async (req, res) => {
  try {
    const { companyName, companyType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      companyName,
      companyType,
      notes,
      documentPath,
      advisoryType: 'incorporation',
    });
    await businessService.save();
    res.json({ success: true, message: 'Company Incorporation request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal & Financial Advisory
router.post('/business-advisory', auth, upload.single('documents'), async (req, res) => {
  try {
    const { query, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      query,
      notes,
      documentPath,
      advisoryType: 'advisory',
    });
    await businessService.save();
    res.json({ success: true, message: 'Legal & Financial Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Startup & MSME Registration requests
router.get('/business-startup/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'startup' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Company Incorporation requests
router.get('/business-incorporation/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'incorporation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal & Financial Advisory requests
router.get('/business-advisory/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'advisory' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all business advisory services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await BusinessAdvisory.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's business advisory services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await BusinessAdvisory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
