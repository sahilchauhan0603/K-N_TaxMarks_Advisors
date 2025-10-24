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
    
    // Update overdue bills first
    await Bill.updateMany(
      { 
        userId,
        status: 'Pending', 
        dueDate: { $lt: new Date() } 
      },
      { 
        status: 'Overdue',
        updatedAt: new Date()
      }
    );

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
    const options = {
      amount: bill.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: bill.billNumber,
      notes: {
        billId: bill._id.toString(),
        userId: userId.toString(),
        serviceType: bill.serviceType,
        serviceName: bill.serviceName
      }
    };

    const order = await razorpay.orders.create(options);

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
      message: 'Failed to create payment order',
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

    // Verify signature
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

module.exports = {
  getUserBills: exports.getUserBills,
  getBillDetails: exports.getBillDetails,
  createPaymentOrder: exports.createPaymentOrder,
  verifyPayment: exports.verifyPayment,
  getAllBills: exports.getAllBills,
  updateBillStatus: exports.updateBillStatus
};