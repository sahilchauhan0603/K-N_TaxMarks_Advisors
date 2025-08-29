const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TaxPlanning = require('../../models/TaxPlanning');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/tax'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Personal & Corporate Tax
router.post('/tax-personal-corporate', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, entityType, incomeDetails, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const planning = new TaxPlanning({
      name,
      email,
      mobile,
      entityType,
      incomeDetails,
      notes,
      documentPath,
      planningType: 'personal_corporate',
    });
    await planning.save();
    res.json({ success: true, message: 'Personal & Corporate Tax request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Year-round Strategies
router.post('/tax-year-round', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, investmentPlans, yearGoals, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const planning = new TaxPlanning({
      name,
      email,
      mobile,
      investmentPlans,
      yearGoals,
      notes,
      documentPath,
      planningType: 'year_round',
    });
    await planning.save();
    res.json({ success: true, message: 'Year-round Strategies request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Tax Compliance & Advisory
router.post('/tax-compliance', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, complianceType, query, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const planning = new TaxPlanning({
      name,
      email,
      mobile,
      complianceType,
      query,
      notes,
      documentPath,
      planningType: 'compliance',
    });
    await planning.save();
    res.json({ success: true, message: 'Tax Compliance & Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Personal & Corporate Tax requests
router.get('/tax-personal-corporate/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'personal_corporate' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Year-round Strategies requests
router.get('/tax-year-round/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'year_round' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Tax Compliance & Advisory requests
router.get('/tax-compliance/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'compliance' }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
