const mongoose = require('mongoose');

// ITR Filing
const ITRFilingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  pan: { type: String, required: true },
  itrType: { type: String, enum: ['Individual', 'Business'] },
  annualIncome: { type: String },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ITR Refund/Notice
const ITRRefundNoticeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  pan: { type: String, required: true },
  refundYear: { type: String },
  noticeType: { type: String },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ITR Document Preparation
const ITRDocumentPrepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  documentType: { type: String },
  notes: { type: String },
  documents: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ITRFiling = mongoose.model('ITRFiling', ITRFilingSchema);
const ITRRefundNotice = mongoose.model('ITRRefundNotice', ITRRefundNoticeSchema);
const ITRDocumentPrep = mongoose.model('ITRDocumentPrep', ITRDocumentPrepSchema);

module.exports = { ITRFiling, ITRRefundNotice, ITRDocumentPrep };
