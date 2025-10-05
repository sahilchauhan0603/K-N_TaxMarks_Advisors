const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Trademark = require('../../models/Trademark');
const auth = require('../../middleware/userAuth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/trademark'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Trademark Search & Registration
router.post('/trademark-search', auth, upload.single('documents'), async (req, res) => {
  try {
    const { brandName, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const trademarkService = new Trademark({
      userId: req.user._id,
      brandName,
      notes,
      documentPath,
      serviceType: 'search',
    });
    await trademarkService.save();
    res.json({ success: true, message: 'Trademark Search & Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal Documentation & Compliance
router.post('/trademark-documentation', auth, upload.single('documents'), async (req, res) => {
  try {
    const { docType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const trademarkService = new Trademark({
      userId: req.user._id,
      docType,
      notes,
      documentPath,
      serviceType: 'documentation',
    });
    await trademarkService.save();
    res.json({ success: true, message: 'Legal Documentation & Compliance request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// IP Protection & Dispute Resolution
router.post('/trademark-protection', auth, upload.single('documents'), async (req, res) => {
  try {
    const { disputeType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const trademarkService = new Trademark({
      userId: req.user._id,
      disputeType,
      notes,
      documentPath,
      serviceType: 'protection',
    });
    await trademarkService.save();
    res.json({ success: true, message: 'IP Protection & Dispute Resolution request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Trademark Search & Registration requests
router.get('/trademark-search/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'search' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal Documentation & Compliance requests
router.get('/trademark-documentation/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'documentation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all IP Protection & Dispute Resolution requests
router.get('/trademark-protection/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'protection' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all trademark services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await Trademark.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's trademark services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await Trademark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
