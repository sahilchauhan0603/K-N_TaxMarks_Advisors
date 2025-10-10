const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Website UI/UX', 'Service Quality', 'New Service Request', 'Technical Issue', 'General Feedback', 'Other'],
    default: 'General Feedback'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isRead: { type: Boolean, default: false },
  adminNotes: { type: String, default: '' }, // For admin internal notes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);