const mongoose = require('mongoose');

const BusinessAdvisorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advisoryType: { type: String },
  businessName: { type: String }, // For Startup
  businessType: { type: String }, // For Startup
  companyName: { type: String }, // For Incorporation
  companyType: { type: String }, // For Incorporation
  query: { type: String }, // For Advisory
  notes: { type: String },
  documentPath: { type: String }, // Cloudinary public_id
  documentUrl: { type: String }, // Cloudinary secure_url
  status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Completed', 'Declined'], default: 'Pending' },
  adminNotes: { type: String }, // Notes from admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BusinessAdvisory = mongoose.model('BusinessAdvisory', BusinessAdvisorySchema);

module.exports = BusinessAdvisory;
