const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const upload = require('../middleware/upload');
const { uploadImage } = require('../config/cloudinary');
const auth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/testimonials - Add a new testimonial with image upload (authenticated users)
router.post('/', auth, upload.single('photo'), async (req, res) => {
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
    
    const testimonial = new Testimonial({ 
      userId: req.user._id,
      name: name || req.user.name, // Use provided name or user's name
      role, 
      photoUrl, 
      service, 
      feedback,
      isApproved: false // Requires admin approval
    });
    
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/testimonials/public - Add testimonial without authentication (for external users)
router.post('/public', upload.single('photo'), async (req, res) => {
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
    
    const testimonial = new Testimonial({ 
      name, 
      role, 
      photoUrl, 
      service, 
      feedback,
      isApproved: false // Requires admin approval
    });
    
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial submitted successfully. It will be reviewed before being published.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials?service=ServiceName - Get approved testimonials for a service
router.get('/', async (req, res) => {
  try {
    const { service } = req.query;
    const filter = { isApproved: true };
    if (service) filter.service = service;
    
    const testimonials = await Testimonial.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials/user/:userId - Get testimonials by specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only see their own testimonials unless they're admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const testimonials = await Testimonial.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials/my - Get current user's testimonials
router.get('/my', auth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/testimonials/:id/approve - Approve testimonial (admin only)
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials/admin/pending - Get pending testimonials (admin only)
router.get('/admin/pending', adminAuth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: false })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/testimonials/admin/all - Get all testimonials (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
