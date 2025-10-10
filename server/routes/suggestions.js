const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const adminAuth = require('../middleware/adminAuth');

// POST /api/suggestions - Submit a new suggestion (public route)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, category, priority } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    
    const suggestion = new Suggestion({ 
      name,
      email,
      subject,
      message,
      category: category || 'General Feedback',
      priority: priority || 'Medium'
    });
    
    await suggestion.save();
    res.status(201).json({ 
      message: 'Thank you for your suggestion! We appreciate your feedback.',
      suggestion: {
        id: suggestion._id,
        name: suggestion.name,
        subject: suggestion.subject,
        category: suggestion.category,
        createdAt: suggestion.createdAt
      }
    });
  } catch (err) {
    console.error('Error creating suggestion:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET /api/suggestions - Get all suggestions (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { category, priority, isRead, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (priority && priority !== 'All') filter.priority = priority;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const suggestions = await Suggestion.find(filter).sort(sort);
    
    res.json({
      suggestions,
      totalCount: suggestions.length,
      unreadCount: await Suggestion.countDocuments({ isRead: false })
    });
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/suggestions/:id - Get specific suggestion (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (err) {
    console.error('Error fetching suggestion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/suggestions/:id/read - Mark suggestion as read/unread (admin only)
router.put('/:id/read', adminAuth, async (req, res) => {
  try {
    const { isRead } = req.body;
    
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json({ message: `Suggestion marked as ${suggestion.isRead ? 'read' : 'unread'}`, suggestion });
  } catch (err) {
    console.error('Error updating suggestion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/suggestions/:id/notes - Add admin notes to suggestion (admin only)
router.put('/:id/notes', adminAuth, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { adminNotes },
      { new: true }
    );
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json({ message: 'Admin notes updated successfully', suggestion });
  } catch (err) {
    console.error('Error updating admin notes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/suggestions/:id - Delete suggestion (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json({ message: 'Suggestion deleted successfully' });
  } catch (err) {
    console.error('Error deleting suggestion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/suggestions/stats/summary - Get suggestion statistics (admin only)
router.get('/stats/summary', adminAuth, async (req, res) => {
  try {
    const totalSuggestions = await Suggestion.countDocuments();
    const unreadSuggestions = await Suggestion.countDocuments({ isRead: false });
    const todaySuggestions = await Suggestion.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    // Category breakdown
    const categoryStats = await Suggestion.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Priority breakdown
    const priorityStats = await Suggestion.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalSuggestions,
      unreadSuggestions,
      todaySuggestions,
      categoryStats,
      priorityStats
    });
  } catch (err) {
    console.error('Error fetching suggestion stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;