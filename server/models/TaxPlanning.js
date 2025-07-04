const mongoose = require('mongoose');

const TaxPlanningSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  planningType: { type: String },
  entityType: { type: String }, // For Personal & Corporate
  incomeDetails: { type: String }, // For Personal & Corporate
  investmentPlans: { type: String }, // For Year-round
  yearGoals: { type: String }, // For Year-round
  complianceType: { type: String }, // For Compliance
  query: { type: String }, // For Compliance
  notes: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const TaxPlanning = mongoose.model('TaxPlanning', TaxPlanningSchema);

module.exports = TaxPlanning;
