const mongoose = require('mongoose');

const GSTSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, enum: ['Registration', 'Return Filing', 'Resolution'], required: true },
  gstNumber: { type: String }, // For Registration and Resolution
  gstin: { type: String }, // For Return Filing
  businessName: { type: String }, // For Registration
  issue: { type: String }, // For Resolution
  notes: { type: String },
  documentPath: { type: String }, // Cloudinary public_id
  documentUrl: { type: String }, // Cloudinary secure_url
  status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Completed', 'Declined'], default: 'Pending' },
  adminNotes: { type: String }, // Notes from admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const GST = mongoose.model('GST', GSTSchema);

module.exports = GST;
