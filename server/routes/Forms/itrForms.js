const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ITR = require('../../models/ITR');
const auth = require('../../middleware/userAuth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/itr'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ITR Filing
router.post('/itr-filing', auth, upload.single('documents'), async (req, res) => {
  try {
    const { pan, itrType, annualIncome, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Filing',
      pan,
      itrType,
      annualIncome,
      notes,
      documentPath
    });
    await itrService.save();
    res.json({ success: true, message: 'ITR Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-filing/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Filing' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Refund/Notice
router.post('/itr-refund-notice', auth, upload.single('documents'), async (req, res) => {
  try {
    const { pan, refundYear, noticeType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Refund/Notice',
      pan,
      refundYear,
      noticeType,
      notes,
      documentPath
    });
    await itrService.save();
    res.status(201).json({ success: true, message: 'ITR Refund/Notice request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-refund-notice/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Refund/Notice' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Document Preparation
router.post('/itr-document-prep', auth, upload.single('documents'), async (req, res) => {
  try {
    const { documentType, notes } = req.body;
    const documentPath = req.file ? req.file.filename : '';
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Document Preparation',
      documentType,
      notes,
      documentPath
    });
    await itrService.save();
    res.status(201).json({ success: true, message: 'ITR Document Preparation request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-document-prep/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Document Preparation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all ITR services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await ITR.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's ITR services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await ITR.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
