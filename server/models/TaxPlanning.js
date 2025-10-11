const mongoose = require('mongoose');

const TaxPlanningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planningType: { type: String },
  entityType: { type: String }, // For Personal & Corporate
  incomeDetails: { type: String }, // For Personal & Corporate
  investmentPlans: { type: String }, // For Year-round
  yearGoals: { type: String }, // For Year-round
  complianceType: { type: String }, // For Compliance
  query: { type: String }, // For Compliance
  notes: { type: String },
  documentPath: { type: String }, // Cloudinary public_id
  documentUrl: { type: String }, // Cloudinary secure_url
  status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Declined'], default: 'Pending' },
  adminNotes: { type: String }, // Notes from admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TaxPlanning = mongoose.model('TaxPlanning', TaxPlanningSchema);

module.exports = TaxPlanning;
