const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const upload = require('../middleware/upload');
const { uploadImage } = require('../config/cloudinary');

// POST /api/testimonials - Add a new testimonial with image upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, role, service, feedback } = req.body;
    let photoUrl = req.body.photoUrl || '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'testimonials');
      photoUrl = result.secure_url;
    }
    
    if (!name || !role || !service || !feedback) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    const testimonial = new Testimonial({ name, role, photoUrl, service, feedback });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials?service=ServiceName - Get testimonials for a service
router.get('/', async (req, res) => {
  try {
    const { service } = req.query;
    const filter = service ? { service } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
