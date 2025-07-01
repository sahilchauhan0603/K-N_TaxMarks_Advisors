const mongoose = require('mongoose');

const TrademarkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  serviceType: { type: String },
  brandName: { type: String }, // For Search
  docType: { type: String }, // For Documentation
  disputeType: { type: String }, // For Protection
  notes: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Trademark = mongoose.model('Trademark', TrademarkSchema);

module.exports = Trademark;
