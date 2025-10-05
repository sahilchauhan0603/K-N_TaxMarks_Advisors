const express = require('express');
const router = express.Router();
const BusinessAdvisory = require('../../models/BusinessAdvisory');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// Startup & MSME Registration
router.post('/business-startup', auth, upload.single('documents'), async (req, res) => {
  try {
    const { businessName, businessType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/startup');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      businessName,
      businessType,
      notes,
      documentPath,
      documentUrl,
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
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/incorporation');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      companyName,
      companyType,
      notes,
      documentPath,
      documentUrl,
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
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/advisory');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      query,
      notes,
      documentPath,
      documentUrl,
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
