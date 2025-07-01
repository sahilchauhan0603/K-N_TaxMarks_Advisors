const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TaxPlanning = require('../models/TaxPlanning');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/tax')); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/tax-planning', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, planningType, annualIncome, notes } = req.body;
    const documentPath = req.file ? req.file.path : null;
    const planning = new TaxPlanning({
      name,
      email,
      mobile,
      planningType,
      annualIncome,
      notes,
      documentPath,
    });
    await planning.save();
    res.json({ success: true, message: 'Tax Planning request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
