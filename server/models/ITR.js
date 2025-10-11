const mongoose = require('mongoose');

const ITRSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, enum: ['Filing', 'Refund/Notice', 'Document Preparation'], required: true },
  pan: { type: String }, // For Filing and Refund/Notice
  itrType: { type: String, enum: ['Individual', 'Business'] }, // For Filing
  annualIncome: { type: String }, // For Filing
  refundYear: { type: String }, // For Refund/Notice
  noticeType: { type: String }, // For Refund/Notice
  documentType: { type: String }, // For Document Preparation
  notes: { type: String },
  documentPath: { type: String }, // Cloudinary public_id
  documentUrl: { type: String }, // Cloudinary secure_url
  status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Declined'], default: 'Pending' },
  adminNotes: { type: String }, // Notes from admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ITR = mongoose.model('ITR', ITRSchema);

module.exports = ITR;
