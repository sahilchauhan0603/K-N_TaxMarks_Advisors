const mongoose = require('mongoose');

const ITRFilingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  pan: { type: String, required: true },
  itrType: { type: String },
  annualIncome: { type: String },
  notes: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ITRFiling = mongoose.model('ITRFiling', ITRFilingSchema);

module.exports = { ITRFiling };
