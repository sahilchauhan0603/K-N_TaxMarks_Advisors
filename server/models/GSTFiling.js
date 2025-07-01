const mongoose = require('mongoose');

const GSTFilingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gstNumber: { type: String, required: true },
  filingType: { type: String, enum: ['Registration', 'Return Filing', 'Resolution'], required: true },
  businessName: { type: String },
  notes: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const GSTFiling = mongoose.model('GSTFiling', GSTFilingSchema);

module.exports = { GSTFiling };
