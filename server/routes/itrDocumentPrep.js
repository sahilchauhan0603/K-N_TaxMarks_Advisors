const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ITRDocumentPrep = require('../models/ITRDocumentPrep');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/itr-document-prep'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('documents'), async (req, res) => {
  try {
    const { name, email, mobile, pan, notes } = req.body;
    const documents = req.file ? req.file.filename : '';
    const newEntry = new ITRDocumentPrep({ name, email, mobile, pan, notes, documents });
    await newEntry.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
