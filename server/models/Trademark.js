const mongoose = require('mongoose');

const TrademarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String },
  brandName: { type: String }, // For Search
  docType: { type: String }, // For Documentation
  disputeType: { type: String }, // For Protection
  notes: { type: String },
  documentPath: { type: String }, // Cloudinary public_id
  documentUrl: { type: String }, // Cloudinary secure_url
  status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Completed', 'Declined'], default: 'Pending' },
  adminNotes: { type: String }, // Notes from admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Trademark = mongoose.model('Trademark', TrademarkSchema);

module.exports = Trademark;
