const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  serviceType: { 
    type: String, 
    enum: ['gst', 'itr', 'tax', 'business', 'trademark'], 
    required: true 
  },
  serviceName: {
    type: String,
    required: true
  },
  billNumber: {
    type: String,
    unique: true,
    required: false // Will be auto-generated
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'], 
    default: 'Pending' 
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'Bank Transfer', 'Cash', 'UPI', 'Credit Card'],
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  invoiceUrl: {
    type: String,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

// Generate bill number
BillSchema.pre('save', async function(next) {
  if (this.isNew && !this.billNumber) {
    try {
      const count = await mongoose.model('Bill').countDocuments();
      const year = new Date().getFullYear();
      this.billNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      // Fallback with timestamp if count fails
      const timestamp = Date.now().toString().slice(-6);
      const year = new Date().getFullYear();
      this.billNumber = `INV-${year}-${timestamp}`;
    }
  }
  next();
});

// Note: Removed problematic pre-find hooks that were interfering with queries
// Overdue status updates are now handled explicitly in the controller functions

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;