const mongoose = require('mongoose');

const ITRDocumentPrepSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  pan: String,
  notes: String,
  documents: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ITRDocumentPrep', ITRDocumentPrepSchema);
