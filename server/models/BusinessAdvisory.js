const mongoose = require('mongoose');

const BusinessAdvisorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  advisoryType: { type: String },
  businessName: { type: String }, // For Startup
  businessType: { type: String }, // For Startup
  companyName: { type: String }, // For Incorporation
  companyType: { type: String }, // For Incorporation
  query: { type: String }, // For Advisory
  notes: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const BusinessAdvisory = mongoose.model('BusinessAdvisory', BusinessAdvisorySchema);

module.exports = BusinessAdvisory;
