const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ITRFiling, ITRRefundNotice, ITRDocumentPrep } = require('../models/ITR');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/itr'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ITR Filing
router.post('/itr-filing', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, pan, itrType, annualIncome, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const filing = new ITRFiling({ name, email, mobile, pan, itrType, annualIncome, notes, documents });
    await filing.save();
    res.json({ success: true, message: 'ITR Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-filing/all', async (req, res) => {
  try {
    const allEntries = await ITRFiling.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Refund/Notice
router.post('/itr-refund-notice', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, pan, refundYear, noticeType, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new ITRRefundNotice({ name, email, mobile, pan, refundYear, noticeType, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/itr-refund-notice/all', async (req, res) => {
  try {
    const allEntries = await ITRRefundNotice.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Document Preparation
router.post('/itr-document-prep', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, documentType, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new ITRDocumentPrep({ name, email, mobile, documentType, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/itr-document-prep/all', async (req, res) => {
  try {
    const allEntries = await ITRDocumentPrep.find().sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
