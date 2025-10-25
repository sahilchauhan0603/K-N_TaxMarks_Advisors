const ExcelJS = require('exceljs');
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/User");

// Get allowed admin emails from environment variable
const getAllowedAdmins = () => {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    console.error('WARNING: ADMIN_EMAILS not set in environment variables!');
    return [];
  }
  return adminEmails.split(',').map(email => email.trim()).filter(email => email.length > 0);
};

const allowedAdmins = getAllowedAdmins();

const OTP_STORE = {};

// Cleanup expired admin OTPs every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const email in OTP_STORE) {
    if (OTP_STORE[email].expires < now) {
      delete OTP_STORE[email];
    }
  }
}, 2 * 60 * 1000);

// Send OTP controller
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Check if email is in allowed list
    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Access denied. This email is not authorized for admin access." });
    }
    
    // Generate secure 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false // Only numbers
    });
    
    // Store OTP with 3-minute expiration
    OTP_STORE[email] = { 
      otp, 
      expires: Date.now() + 3 * 60 * 1000,
      attempts: 0 // Track failed attempts
    };

  // Send OTP via email using mailer utility
  await sendMail(
    email,
    "Your Admin OTP",
    undefined,
    `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
        <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 18px;">
            <div style="display: inline-block; background: linear-gradient(90deg,#3b82f6,#6366f1); border-radius: 50%; padding: 16px; margin-bottom: 8px;">
              <img src='https://cdn-icons-png.flaticon.com/512/3064/3064197.png' alt='Admin OTP' style='width: 40px; height: 40px;' />
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 700; color: #1e293b; margin: 0;">Admin Panel Login OTP</h2>
            <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Use the OTP below to sign in as admin. This code is valid for 3 minutes.</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; font-size: 2.2rem; letter-spacing: 0.3em; font-weight: 700; color: #2563eb; background: #f1f5f9; border-radius: 12px; padding: 16px 32px; border: 1px dashed #6366f1;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 0.98rem; text-align: center; margin-bottom: 0;">If you did not request this OTP, you can safely ignore this email.<br/>For support, contact your site administrator.</p>
          <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
        </div>
      </div>
    `
  );
  res.json({ message: "OTP sent" });
  } catch (error) {
    console.error('Admin OTP send error:', error);
    res.status(500).json({ message: "Server error while sending OTP" });
  }
};
// Verify OTP controller
exports.verifyOTP = (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    
    // Validate email is authorized
    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Get stored OTP record
    const record = OTP_STORE[email];
    
    // Check if OTP exists
    if (!record) {
      return res.status(401).json({ message: "OTP not found. Please request a new OTP." });
    }
    
    // Check if OTP has expired
    if (record.expires < Date.now()) {
      delete OTP_STORE[email]; // Clean up expired OTP
      return res.status(401).json({ message: "OTP has expired. Please request a new OTP." });
    }
    
    // Increment attempt counter
    record.attempts = (record.attempts || 0) + 1;
    
    // Check for too many attempts (max 5 attempts)
    if (record.attempts > 5) {
      delete OTP_STORE[email]; // Clean up after too many attempts
      return res.status(401).json({ message: "Too many failed attempts. Please request a new OTP." });
    }
    
    // Verify OTP matches
    if (record.otp !== otp.toString()) {
      // Update the record with increased attempt count but don't delete yet
      OTP_STORE[email] = record;
      const remainingAttempts = 5 - record.attempts;
      return res.status(401).json({ 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
      });
    }
    
    // OTP is valid - clean up and generate token
    delete OTP_STORE[email];
    
    // Generate admin JWT token
    const token = jwt.sign(
      { 
        email, 
        admin: true, 
        loginTime: new Date().toISOString() 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "2h" }
    );
    
    res.json({ 
      success: true,
      message: "Admin login successful",
      token 
    });
    
  } catch (error) {
    console.error('Admin OTP verification error:', error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};


// Get all users controller
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
// Delete user controller
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// Dashboard stats controller
exports.getDashboardStats = async (req, res) => {
  try {
    const Trademark = require("../models/Trademark");
    const TaxPlanning = require("../models/TaxPlanning");
    const BusinessAdvisory = require("../models/BusinessAdvisory");
    const GST = require("../models/GST");
    const ITR = require("../models/ITR");

    // Users
    const users = await User.find().select("-password");
    const total = users.length;
    const now = Date.now();
    const active = users.filter(
      (u) => now - new Date(u.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
    ).length;
    const inactive = total - active;
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Monthly stats (last 6 months)
    const monthly = Array(6)
      .fill(0)
      .map((_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - (5 - i));
        const m = month.getMonth(),
          y = month.getFullYear();
        return {
          name: month.toLocaleString("default", { month: "short" }),
          Users: users.filter((u) => {
            const d = new Date(u.createdAt);
            return d.getMonth() === m && d.getFullYear() === y;
          }).length,
          Revenue: 0, // Placeholder, see below
        };
      });

    // Daily activity (last 7 days) - Real user activity data
    const Testimonial = require("../models/Testimonial");
    const Suggestion = require("../models/Suggestion");
    
    const dailyActivity = await Promise.all(
      Array(7)
        .fill(0)
        .map(async (_, i) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - i));
          day.setHours(0, 0, 0, 0);
          const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
          const dayStr = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          // Count various user activities for this day
          const [signups, gstSubmissions, itrSubmissions, trademarkSubmissions, 
                 taxSubmissions, businessSubmissions, testimonials, suggestions] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            GST.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            ITR.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            Trademark.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            TaxPlanning.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            BusinessAdvisory.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            Testimonial.countDocuments({ createdAt: { $gte: day, $lt: nextDay } }),
            Suggestion.countDocuments({ createdAt: { $gte: day, $lt: nextDay } })
          ]);

          const totalActivity = signups + gstSubmissions + itrSubmissions + trademarkSubmissions + 
                               taxSubmissions + businessSubmissions + testimonials + suggestions;

          return {
            name: dayStr,
            Signups: signups,
            "Service Forms": gstSubmissions + itrSubmissions + trademarkSubmissions + taxSubmissions + businessSubmissions,
            Testimonials: testimonials,
            Suggestions: suggestions,
            "Total Activity": totalActivity
          };
        })
    );

    // Service counts
    const gst = await GST.countDocuments();
    const trademark = await Trademark.countDocuments();
    const tax = await TaxPlanning.countDocuments();
    const business = await BusinessAdvisory.countDocuments();
    const itr = await ITR.countDocuments();
    const other = 0;

    // Revenue (if you have a field, sum it; else, keep as 0 or estimate)
    let revenue = 0;
    // If you have a revenue field in any model, sum it here

    // Fill monthly revenue if you have per-user or per-service revenue
    // For now, keep as 0

    res.json({
      total,
      active,
      inactive,
      monthly,
      dailyActivity,
      revenue,
      services: { gst, trademark, tax, business, itr, other },
      recentUsers,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};


// Export users to Excel controller
exports.exportUsersExcel = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 22 },
    ];
    users.forEach(user => {
      worksheet.addRow({
        name: user.name || user.given_name || user.first_name || '',
        email: user.email,
        phone: user.phone || '',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to export users', error: err.message });
  }
};
// Export services to Excel controller
exports.exportServicesExcel = async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GST = require('../models/GST');
    const ITR = require('../models/ITR');

    // Collect all service data
    const gstRegistration = await GST.find({ serviceType: 'Registration' }).populate('userId', 'name email phone');
    const gstReturnFiling = await GST.find({ serviceType: 'Return Filing' }).populate('userId', 'name email phone');
    const gstResolution = await GST.find({ serviceType: 'Resolution' }).populate('userId', 'name email phone');
    const trademark = await Trademark.find().populate('userId', 'name email phone');
    const tax = await TaxPlanning.find().populate('userId', 'name email phone');
    const business = await BusinessAdvisory.find().populate('userId', 'name email phone');
    const itrFiling = await ITR.find({ serviceType: 'Filing' }).populate('userId', 'name email phone');
    const itrRefundNotice = await ITR.find({ serviceType: 'Refund/Notice' }).populate('userId', 'name email phone');
    const itrDocumentPrep = await ITR.find({ serviceType: 'Document Preparation' }).populate('userId', 'name email phone');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Services');
    worksheet.columns = [
      { header: 'Service Type', key: 'type', width: 22 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 22 },
    ];
    const addRows = (arr, type) => {
      arr.forEach(item => {
        worksheet.addRow({
          type,
          name: item.userId?.name || '',
          email: item.userId?.email || '',
          phone: item.userId?.phone || '',
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
        });
      });
    };
    addRows(gstRegistration, 'GST Registration');
    addRows(gstReturnFiling, 'GST Return Filing');
    addRows(gstResolution, 'GST Resolution');
    addRows(trademark, 'Trademark');
    addRows(tax, 'Tax Planning');
    addRows(business, 'Business Advisory');
    addRows(itrFiling, 'ITR Filing');
    addRows(itrRefundNotice, 'ITR Refund/Notice');
    addRows(itrDocumentPrep, 'ITR Document Preparation');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=services_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to export services', error: err.message });
  }
};
// Get services report controller
exports.getServicesReport = async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GST = require('../models/GST');
    const ITR = require('../models/ITR');

    // Collect all service data
    const gstRegistration = await GST.find({ serviceType: 'Registration' }).populate('userId', 'name email phone');
    const gstReturnFiling = await GST.find({ serviceType: 'Return Filing' }).populate('userId', 'name email phone');
    const gstResolution = await GST.find({ serviceType: 'Resolution' }).populate('userId', 'name email phone');
    const trademark = await Trademark.find().populate('userId', 'name email phone');
    const tax = await TaxPlanning.find().populate('userId', 'name email phone');
    const business = await BusinessAdvisory.find().populate('userId', 'name email phone');
    const itrFiling = await ITR.find({ serviceType: 'Filing' }).populate('userId', 'name email phone');
    const itrRefundNotice = await ITR.find({ serviceType: 'Refund/Notice' }).populate('userId', 'name email phone');
    const itrDocumentPrep = await ITR.find({ serviceType: 'Document Preparation' }).populate('userId', 'name email phone');

    const rows = [];
    const addRows = (arr, type) => {
      arr.forEach(item => {
        rows.push({
          type,
          name: item.userId?.name || '',
          email: item.userId?.email || '',
          mobile: item.userId?.phone || '',
          createdAt: item.createdAt || '',
        });
      });
    };
    addRows(gstRegistration, 'GST Registration');
    addRows(gstReturnFiling, 'GST Return Filing');
    addRows(gstResolution, 'GST Resolution');
    addRows(trademark, 'Trademark');
    addRows(tax, 'Tax Planning');
    addRows(business, 'Business Advisory');
    addRows(itrFiling, 'ITR Filing');
    addRows(itrRefundNotice, 'ITR Refund/Notice');
    addRows(itrDocumentPrep, 'ITR Document Preparation');

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services report', error: err.message });
  }
};


// Get all services with status for admin panel
exports.getAllServices = async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GST = require('../models/GST');
    const ITR = require('../models/ITR');
    const Bill = require('../models/Bill');

    // Collect all service data with status
    const [gstServices, itrServices, taxServices, businessServices, trademarkServices] = await Promise.all([
      GST.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      ITR.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      TaxPlanning.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      BusinessAdvisory.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      Trademark.find().populate('userId', 'name email phone').sort({ createdAt: -1 })
    ]);

    // Function to attach bill information to services
    const attachBillInfo = async (services, serviceType) => {
      return Promise.all(services.map(async (service) => {
        const bill = await Bill.findOne({
          serviceId: service._id,
          serviceType: serviceType
        });
        
        const serviceObj = service.toObject();
        serviceObj.bill = bill; // Attach bill information
        return serviceObj;
      }));
    };

    // Attach bill information to each service type
    const [gstWithBills, itrWithBills, taxWithBills, businessWithBills, trademarkWithBills] = await Promise.all([
      attachBillInfo(gstServices, 'gst'),
      attachBillInfo(itrServices, 'itr'),
      attachBillInfo(taxServices, 'tax'),
      attachBillInfo(businessServices, 'business'),
      attachBillInfo(trademarkServices, 'trademark')
    ]);

    const services = {
      gst: gstWithBills,
      itr: itrWithBills,
      tax: taxWithBills,
      business: businessWithBills,
      trademark: trademarkWithBills
    };

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};


// Get specific service details
exports.getServiceDetails = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;
    
    let Model;
    switch (serviceType) {
      case 'gst':
        Model = require('../models/GST');
        break;
      case 'itr':
        Model = require('../models/ITR');
        break;
      case 'tax':
        Model = require('../models/TaxPlanning');
        break;
      case 'business':
        Model = require('../models/BusinessAdvisory');
        break;
      case 'trademark':
        Model = require('../models/Trademark');
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type' });
    }

    const service = await Model.findById(serviceId).populate('userId', 'name email phone');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service details', error: err.message });
  }
};


// Update service status and create bill if completed
exports.updateServiceStatus = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;
    const { status, adminNotes, billAmount, billDescription } = req.body;

    // Validate status
    if (!['Pending', 'In Progress', 'Approved', 'Completed', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let Model;
    switch (serviceType) {
      case 'gst':
        Model = require('../models/GST');
        break;
      case 'itr':
        Model = require('../models/ITR');
        break;
      case 'tax':
        Model = require('../models/TaxPlanning');
        break;
      case 'business':
        Model = require('../models/BusinessAdvisory');
        break;
      case 'trademark':
        Model = require('../models/Trademark');
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type' });
    }

    const service = await Model.findByIdAndUpdate(
      serviceId,
      { 
        status, 
        adminNotes: adminNotes || '',
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if userId exists
    if (!service.userId) {
      return res.status(400).json({ 
        message: 'Service has no associated user - cannot update status', 
        serviceId: service._id
      });
    }

    // If service is completed, create a bill
    if (status === 'Completed') {
      const numericBillAmount = parseFloat(billAmount);
      if (!billAmount || isNaN(numericBillAmount) || numericBillAmount <= 0) {
        return res.status(400).json({ 
          message: 'Valid bill amount is required for completed services',
          received: { billAmount, type: typeof billAmount }
        });
      }

      const Bill = require('../models/Bill');
      
      // Check if bill already exists for this service
      const existingBill = await Bill.findOne({ serviceId, serviceType });
      if (existingBill) {
        return res.status(400).json({ message: 'Bill already exists for this service' });
      }

      // Get service name mapping
      const serviceNames = {
        'gst': 'GST Services',
        'itr': 'ITR Filing',
        'tax': 'Tax Planning',
        'business': 'Business Advisory',
        'trademark': 'Trademark Registration'
      };

      // Create due date (72 hours from now)
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + 72);

      // Get userId - handle both populated and non-populated cases
      let userId;
      if (typeof service.userId === 'object' && service.userId._id) {
        userId = service.userId._id; // Populated user object
      } else if (service.userId) {
        userId = service.userId; // Direct ObjectId reference
      } else {
        return res.status(400).json({ 
          message: 'Cannot create bill: service has no associated user',
          serviceData: { id: service._id, userId: service.userId }
        });
      }

      const billData = {
        userId: userId,
        serviceId: service._id,
        serviceType,
        serviceName: serviceNames[serviceType],
        amount: numericBillAmount,
        description: billDescription || `Payment for ${serviceNames[serviceType]} service`,
        dueDate,
        adminNotes: adminNotes || ''
      };

      const newBill = new Bill(billData);

      // Save with error handling
      try {
        const savedBill = await newBill.save();
      } catch (billError) {
        return res.status(500).json({ 
          message: 'Service updated but bill creation failed', 
          error: billError.message,
          service 
        });
      }

      // Send email notification to user
      const sendMail = require("../utils/mailer");
      const userEmail = typeof service.userId === 'object' ? service.userId.email : null;
      
      if (userEmail) {
        await sendMail(
          userEmail,
        "Service Completed - Payment Required",
        undefined,
        `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Service Completed! 🎉</h2>
                <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Your ${serviceNames[serviceType]} service has been completed successfully.</p>
              </div>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; color: #374151;">Bill Details:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Bill Number:</p>
                    <p style="margin: 4px 0; font-weight: 600;">${newBill.billNumber}</p>
                  </div>
                  <div>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Amount:</p>
                    <p style="margin: 4px 0; font-weight: 600; color: #059669;">₹${billAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Due Date:</p>
                    <p style="margin: 4px 0; font-weight: 600; color: #dc2626;">${dueDate.toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 0.9rem;">Service:</p>
                    <p style="margin: 4px 0; font-weight: 600;">${serviceNames[serviceType]}</p>
                  </div>
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #92400e; font-weight: 600;">⚠️ Payment Required Within 72 Hours</p>
                <p style="margin: 8px 0 0 0; color: #92400e; font-size: 0.9rem;">Please complete your payment within 72 hours to avoid service delays.</p>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${'https://kandn-taxmarks-advisors.onrender.com'|| 'http://localhost:5173'}/profile" style="display: inline-block; background: linear-gradient(90deg, #3b82f6, #1d4ed8); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 1rem;">Pay Now</a>
              </div>

              <p style="color: #64748b; font-size: 0.9rem; text-align: center; margin-bottom: 0;">If you have any questions, please contact our support team.</p>
              <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
            </div>
          </div>
        `
        );
      }

      return res.json({ 
        message: 'Service completed and bill created successfully', 
        service,
        bill: newBill
      });
    }

    res.json({ message: 'Service status updated successfully', service });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service status', error: err.message });
  }
};


// Delete service (only for declined services)
exports.deleteService = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;

    let Model;
    switch (serviceType) {
      case 'gst':
        Model = require('../models/GST');
        break;
      case 'itr':
        Model = require('../models/ITR');
        break;
      case 'tax':
        Model = require('../models/TaxPlanning');
        break;
      case 'business':
        Model = require('../models/BusinessAdvisory');
        break;
      case 'trademark':
        Model = require('../models/Trademark');
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type' });
    }

    // Find the service and check if it's declined
    const service = await Model.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Only allow deletion of declined services
    if (service.status !== 'Declined') {
      return res.status(400).json({ 
        message: 'Only declined services can be deleted' 
      });
    }

    // Delete the service
    await Model.findByIdAndDelete(serviceId);

    res.json({ 
      message: 'Declined service deleted successfully',
      serviceId,
      serviceType 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete service', 
      error: err.message 
    });
  }
};

// Get service pricing configuration for admin
exports.getServicePricing = async (req, res) => {
  try {
    const { getAllServicesForAdmin } = require('../config/servicePricing');
    const services = getAllServicesForAdmin();
    
    res.json({
      success: true,
      services,
      message: 'Service pricing retrieved successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to retrieve service pricing', 
      error: err.message 
    });
  }
};