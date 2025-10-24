const mongoose = require('mongoose');

const othersContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    enum: ['cookie-policy', 'faq', 'privacy-policy', 'sitemap', 'terms'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedByEmail: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient queries
othersContactSchema.index({ createdAt: -1 });
othersContactSchema.index({ status: 1 });
othersContactSchema.index({ source: 1 });
othersContactSchema.index({ email: 1 });

module.exports = mongoose.model('OthersContact', othersContactSchema);