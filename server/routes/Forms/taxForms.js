const express = require('express');
const router = express.Router();
const TaxPlanning = require('../../models/TaxPlanning');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// Personal & Corporate Tax
router.post('/tax-personal-corporate', auth, upload.single('documents'), async (req, res) => {
  try {
    const { entityType, incomeDetails, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/personal-corporate');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      entityType,
      incomeDetails,
      notes,
      documentPath,
      documentUrl,
      planningType: 'personal_corporate',
    });
    await taxService.save();
    res.json({ success: true, message: 'Personal & Corporate Tax request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Year-round Strategies
router.post('/tax-year-round', auth, upload.single('documents'), async (req, res) => {
  try {
    const { investmentPlans, yearGoals, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/year-round');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      investmentPlans,
      yearGoals,
      notes,
      documentPath,
      documentUrl,
      planningType: 'year_round',
    });
    await taxService.save();
    res.json({ success: true, message: 'Year-round Strategies request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Tax Compliance & Advisory
router.post('/tax-compliance', auth, upload.single('documents'), async (req, res) => {
  try {
    const { complianceType, query, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/compliance');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      complianceType,
      query,
      notes,
      documentPath,
      documentUrl,
      planningType: 'compliance',
    });
    await taxService.save();
    res.json({ success: true, message: 'Tax Compliance & Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Personal & Corporate Tax requests
router.get('/tax-personal-corporate/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'personal_corporate' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Year-round Strategies requests
router.get('/tax-year-round/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'year_round' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Tax Compliance & Advisory requests
router.get('/tax-compliance/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'compliance' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all tax planning services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await TaxPlanning.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's tax planning services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await TaxPlanning.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
