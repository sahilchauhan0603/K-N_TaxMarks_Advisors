const mongoose = require('mongoose');

const servicePricingSchema = new mongoose.Schema({
  serviceCategory: {
    type: String,
    required: true,
    enum: ['itr', 'gst', 'trademark', 'business', 'tax']
  },
  serviceType: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String, // Admin ID who created
    default: 'system'
  },
  updatedBy: {
    type: String, // Admin ID who last updated
    default: 'system'
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique service identification
servicePricingSchema.index({ serviceCategory: 1, serviceType: 1 }, { unique: true });

module.exports = mongoose.model('ServicePricing', servicePricingSchema);