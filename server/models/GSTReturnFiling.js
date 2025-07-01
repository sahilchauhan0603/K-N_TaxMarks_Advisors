const mongoose = require('mongoose');

const GSTReturnFilingSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  gstin: String,
  notes: String,
  documents: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GSTReturnFiling', GSTReturnFilingSchema);
