const Bill = require('../models/Bill');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// Get all bills for logged-in user
exports.getUserBills = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // First, find bills that need to be marked as overdue
    const billsToUpdate = await Bill.find({
      userId,
      status: 'Pending',
      dueDate: { $lt: now }
    });

    // Update each bill individually to ensure proper originalAmount setting
    for (const bill of billsToUpdate) {
      // Set originalAmount if it doesn't exist or is 0/null
      if (!bill.originalAmount || bill.originalAmount === 0) {
        bill.originalAmount = bill.amount;
      }
      
      bill.status = 'Overdue';
      bill.overdueSince = now;
      bill.updatedAt = now;
      
      await bill.save();
    }

    // Calculate penalty amounts for overdue bills
    const overdueBills = await Bill.find({
      userId,
      status: 'Overdue'
    });

    for (const bill of overdueBills) {
      // Skip if originalAmount is not properly set (indicates a corrupted bill)
      if (!bill.originalAmount || bill.originalAmount === 0) {
        continue;
      }      // Calculate overdue days from either overdueSince or dueDate
      let overdueDays;
      if (bill.overdueSince) {
        overdueDays = Math.floor((now - bill.overdueSince) / (1000 * 60 * 60 * 24));
      } else {
        overdueDays = Math.floor((now - bill.dueDate) / (1000 * 60 * 60 * 24));
        // Set overdueSince if not set
        bill.overdueSince = bill.dueDate;
      }
      
      // CRITICAL: Always use the stored originalAmount, never the current total amount
      const originalAmount = bill.originalAmount;
      
      // Calculate penalty: 5% per week overdue (minimum 1 week)
      const weeksOverdue = Math.max(1, Math.ceil(overdueDays / 7));
      const penaltyMultiplier = weeksOverdue * (bill.penaltyRate || 0.05);
      const penaltyAmount = Math.round(originalAmount * penaltyMultiplier);
      const totalAmount = originalAmount + penaltyAmount;

      // Only update if the penalty or total has actually changed
      if (bill.penaltyAmount !== penaltyAmount || bill.amount !== totalAmount) {
        bill.penaltyAmount = penaltyAmount;
        bill.amount = totalAmount;
        bill.updatedAt = now;
        await bill.save();
      }
    }

    const bills = await Bill.find({ userId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    const stats = {
      total: bills.length,
      totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
      paid: bills.filter(bill => bill.status === 'Paid').length,
      paidAmount: bills.filter(bill => bill.status === 'Paid').reduce((sum, bill) => sum + bill.amount, 0),
      pending: bills.filter(bill => bill.status === 'Pending').length,
      pendingAmount: bills.filter(bill => bill.status === 'Pending').reduce((sum, bill) => sum + bill.amount, 0),
      overdue: bills.filter(bill => bill.status === 'Overdue').length,
      overdueAmount: bills.filter(bill => bill.status === 'Overdue').reduce((sum, bill) => sum + bill.amount, 0),
    };

    res.json({
      success: true,
      bills,
      stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: err.message
    });
  }
};

// Get single bill details
exports.getBillDetails = async (req, res) => {
  try {
    const { billId } = req.params;
    const userId = req.user.id;

    const bill = await Bill.findOne({ _id: billId, userId })
      .populate('userId', 'name email phone');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      bill
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill details',
      error: err.message
    });
  }
};

// Create Razorpay order for bill payment
exports.createPaymentOrder = async (req, res) => {
  try {
    const { billId } = req.body;
    const userId = req.user.id;

    const bill = await Bill.findOne({ 
      _id: billId, 
      userId,
      status: { $in: ['Pending', 'Overdue'] }
    }).populate('userId', 'name email phone');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found or already paid'
      });
    }

    // Create Razorpay order
    const amountInPaise = Math.round(bill.amount * 100); // Ensure it's an integer
    const options = {
      amount: amountInPaise, // Amount in paise (must be integer)
      currency: 'INR',
      receipt: bill.billNumber || `BILL_${Date.now()}`, // Ensure receipt exists
      notes: {
        billId: bill._id.toString(),
        userId: userId.toString(),
        serviceType: bill.serviceType,
        serviceName: bill.serviceName
      }
    };

    // Validate required fields
    if (amountInPaise < 100) { // Minimum 1 INR
      throw new Error('Amount must be at least 1 INR (100 paise)');
    }

    // Validate order options
    if (!options.amount || options.amount <= 0) {
      throw new Error('Invalid amount for Razorpay order');
    }

    let order;
    
    // Use mock payment for development - Change to false when ready for real payments
    const useMockPayment = true;
    
    if (useMockPayment) {
      // Mock payment for testing
      order = {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000)
      };
    } else {
      // Real Razorpay API (when ready for production)
      try {
        order = await razorpay.orders.create(options);
      } catch (razorpayError) {
        // Provide helpful error messages
        if (razorpayError.statusCode === 400) {
          throw new Error(`Razorpay validation error: ${razorpayError.description || razorpayError.message}`);
        } else if (razorpayError.statusCode === 401) {
          throw new Error('Razorpay authentication failed. Please check your API credentials.');
        } else {
          throw new Error(`Razorpay API error: ${razorpayError.message}`);
        }
      }
    }

    // Update bill with Razorpay order ID
    bill.razorpayOrderId = order.id;
    await bill.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      bill: {
        _id: bill._id,
        billNumber: bill.billNumber,
        amount: bill.amount,
        serviceName: bill.serviceName,
        description: bill.description
      },
      user: {
        name: bill.userId.name,
        email: bill.userId.email,
        phone: bill.userId.phone
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create payment order',
      error: err.message
    });
  }
};

// Verify Razorpay payment and update bill status
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      billId,
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;
    const userId = req.user.id;

    // Check if this is a mock payment
    const isMockPayment = razorpay_order_id?.startsWith('order_mock_');
    
    if (!isMockPayment) {
      // Verify signature for real payments
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
    }

    // Find and update bill
    const bill = await Bill.findOneAndUpdate(
      { 
        _id: billId, 
        userId,
        razorpayOrderId: razorpay_order_id,
        status: { $in: ['Pending', 'Overdue'] }
      },
      {
        status: 'Paid',
        paymentMethod: 'Razorpay',
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found or payment verification failed'
      });
    }

    // Send payment confirmation email
    const sendMail = require("../utils/mailer");
    await sendMail(
      bill.userId.email,
      "Payment Successful - Receipt",
      undefined,
      `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(90deg,#10b981,#059669); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                <span style="font-size: 2rem;">✅</span>
              </div>
              <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Payment Successful!</h2>
              <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Thank you for your payment. Your service is now complete.</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px 0; color: #374151;">Payment Receipt:</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Bill Number:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.billNumber}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Amount Paid:</p>
                  <p style="margin: 4px 0; font-weight: 600; color: #059669;">₹${bill.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Payment Date:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Payment ID:</p>
                  <p style="margin: 4px 0; font-weight: 600; font-size: 0.8rem;">${razorpay_payment_id}</p>
                </div>
                <div style="grid-column: 1 / -1;">
                  <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Service:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.serviceName}</p>
                </div>
              </div>
            </div>

            <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #166534; font-weight: 600;">🎉 Service Completed Successfully!</p>
              <p style="margin: 8px 0 0 0; color: #166534; font-size: 0.9rem;">Your ${bill.serviceName} service has been completed and payment received.</p>
            </div>

            <p style="color: #64748b; font-size: 0.9rem; text-align: center; margin-bottom: 0;">Keep this receipt for your records. If you have any questions, please contact our support team.</p>
            <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
          </div>
        </div>
      `
    );

    res.json({
      success: true,
      message: 'Payment verified and bill updated successfully',
      bill
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: err.message
    });
  }
};

// Admin: Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bills = await Bill.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Bill.countDocuments(query);

    const stats = {
      total: await Bill.countDocuments(),
      totalAmount: await Bill.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      paid: await Bill.countDocuments({ status: 'Paid' }),
      pending: await Bill.countDocuments({ status: 'Pending' }),
      overdue: await Bill.countDocuments({ status: 'Overdue' }),
    };

    res.json({
      success: true,
      bills,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total
      },
      stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: err.message
    });
  }
};

// Admin: Update bill status
exports.updateBillStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const { status, adminNotes } = req.body;

    if (!['Pending', 'Paid', 'Overdue', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const bill = await Bill.findByIdAndUpdate(
      billId,
      {
        status,
        adminNotes: adminNotes || bill.adminNotes,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill status updated successfully',
      bill
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bill status',
      error: err.message
    });
  }
};

// Admin: Manually trigger overdue processing (for testing)
exports.processOverdueBills = async (req, res) => {
  try {
    const overdueService = require('../services/overdueService');
    await overdueService.processOverdueBills();
    
    res.json({
      success: true,
      message: 'Overdue bills processed successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to process overdue bills',
      error: err.message
    });
  }
};

module.exports = {
  getUserBills: exports.getUserBills,
  getBillDetails: exports.getBillDetails,
  createPaymentOrder: exports.createPaymentOrder,
  verifyPayment: exports.verifyPayment,
  getAllBills: exports.getAllBills,
  updateBillStatus: exports.updateBillStatus,
  processOverdueBills: exports.processOverdueBills
};