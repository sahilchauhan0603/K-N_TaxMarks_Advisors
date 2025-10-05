const express = require('express');
const router = express.Router();
const GST = require('../../models/GST');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// GST Registration
router.post('/gst-registration', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstNumber, businessName, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/registration');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Registration',
      gstNumber,
      businessName,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();
    res.json({ success: true, message: 'GST Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-registration/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Registration' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Return Filing
router.post('/gst-return-filing', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstin, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/return-filing');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Return Filing',
      gstin,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();
    res.status(201).json({ success: true, message: 'GST Return Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-return-filing/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Return Filing' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Resolution
router.post('/gst-resolution', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstNumber, issue, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/resolution');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Resolution',
      gstNumber,
      issue,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();
    res.status(201).json({ success: true, message: 'GST Resolution request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-resolution/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Resolution' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all GST services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await GST.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's GST services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await GST.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
