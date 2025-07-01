const mongoose = require('mongoose');

// GST Filing
const GSTFilingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gstNumber: { type: String, required: true },
  filingType: { type: String, enum: ['Registration', 'Return Filing', 'Resolution'], required: true },
  businessName: { type: String },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// GST Return Filing
const GSTReturnFilingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gstin: { type: String, required: true },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// GST Resolution
const GSTResolutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gstNumber: { type: String, required: true },
  issue: { type: String },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const GSTFiling = mongoose.model('GSTFiling', GSTFilingSchema);
const GSTReturnFiling = mongoose.model('GSTReturnFiling', GSTReturnFilingSchema);
const GSTResolution = mongoose.model('GSTResolution', GSTResolutionSchema);

module.exports = { GSTFiling, GSTReturnFiling, GSTResolution };
