const ExcelJS = require('exceljs');
const express = require("express");
const router = express.Router();
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");

const allowedAdmins = [
  "sahilchauhan0603@gmail.com",
  "sahilpersonal2003@gmail.com",
  "saritachauhan0704@gmail.com",
];

const OTP_STORE = {};

// Send OTP endpoint
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!allowedAdmins.includes(email)) {
    return res.status(403).json({ message: "Not allowed" });
  }
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
  OTP_STORE[email] = { otp, expires: Date.now() + 3 * 60 * 1000 };

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
});

// Verify OTP endpoint
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = OTP_STORE[email];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }
  delete OTP_STORE[email];
  const token = jwt.sign({ email, admin: true }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

// Get all users (admin only)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Dashboard stats endpoint
router.get("/dashboard-stats", adminAuth, async (req, res) => {
  try {
    const Trademark = require("../models/Trademark");
    const TaxPlanning = require("../models/TaxPlanning");
    const BusinessAdvisory = require("../models/BusinessAdvisory");
    const GSTModels = require("../models/GST");
    const GSTFiling = GSTModels.GSTFiling;
    const GSTReturnFiling = GSTModels.GSTReturnFiling;
    const GSTResolution = GSTModels.GSTResolution;
    const {
      ITRFiling,
      ITRRefundNotice,
      ITRDocumentPrep,
    } = require("../models/ITR");

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

    // Daily activity (last 7 days)
    const dailyActivity = Array(7)
      .fill(0)
      .map((_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - i));
        day.setHours(0, 0, 0, 0);
        const dayStr = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          name: dayStr,
          Signups: users.filter((u) => {
            const d = new Date(u.createdAt);
            return d >= day && d < new Date(day.getTime() + 24 * 60 * 60 * 1000);
          }).length,
        };
      });

    // Service counts
    const gst =
      (await GSTFiling.countDocuments()) +
      (await GSTReturnFiling.countDocuments()) +
      (await GSTResolution.countDocuments());
    const trademark = await Trademark.countDocuments();
    const tax = await TaxPlanning.countDocuments();
    const business = await BusinessAdvisory.countDocuments();
    const itr =
      (await ITRFiling.countDocuments()) +
      (await ITRDocumentPrep.countDocuments()) +
      (await ITRRefundNotice.countDocuments());
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
});


// Export users to Excel
router.get('/export-users-excel', adminAuth, async (req, res) => {
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
});

// Export services to Excel
router.get('/export-services-excel', adminAuth, async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GSTModels = require('../models/GST');
    const GSTFiling = GSTModels.GSTFiling;
    const GSTReturnFiling = GSTModels.GSTReturnFiling;
    const GSTResolution = GSTModels.GSTResolution;
    const { ITRFiling, ITRRefundNotice, ITRDocumentPrep } = require('../models/ITR');

    // Collect all service data
    const gst = await GSTFiling.find();
    const gstReturn = await GSTReturnFiling.find();
    const gstResolution = await GSTResolution.find();
    const trademark = await Trademark.find();
    const tax = await TaxPlanning.find();
    const business = await BusinessAdvisory.find();
    const itr = await ITRFiling.find();
    const itrPrep = await ITRDocumentPrep.find();
    const itrRefund = await ITRRefundNotice.find();

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
          name: item.name || '',
          email: item.email || '',
          phone: item.mobile || item.phone || '',
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
        });
      });
    };
    addRows(gst, 'GST Filing');
    addRows(gstReturn, 'GST Return Filing');
    addRows(gstResolution, 'GST Resolution');
    addRows(trademark, 'Trademark');
    addRows(tax, 'Tax Planning');
    addRows(business, 'Business Advisory');
    addRows(itr, 'ITR Filing');
    addRows(itrPrep, 'ITR Document Prep');
    addRows(itrRefund, 'ITR Refund Notice');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=services_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to export services', error: err.message });
  }
});

// Return all services data as JSON for frontend table
router.get('/services-report', adminAuth, async (req, res) => {
  try {
    const Trademark = require('../models/Trademark');
    const TaxPlanning = require('../models/TaxPlanning');
    const BusinessAdvisory = require('../models/BusinessAdvisory');
    const GSTModels = require('../models/GST');
    const GSTFiling = GSTModels.GSTFiling;
    const GSTReturnFiling = GSTModels.GSTReturnFiling;
    const GSTResolution = GSTModels.GSTResolution;
    const { ITRFiling, ITRRefundNotice, ITRDocumentPrep } = require('../models/ITR');

    // Collect all service data
    const gst = await GSTFiling.find();
    const gstReturn = await GSTReturnFiling.find();
    const gstResolution = await GSTResolution.find();
    const trademark = await Trademark.find();
    const tax = await TaxPlanning.find();
    const business = await BusinessAdvisory.find();
    const itr = await ITRFiling.find();
    const itrPrep = await ITRDocumentPrep.find();
    const itrRefund = await ITRRefundNotice.find();

    const rows = [];
    const addRows = (arr, type) => {
      arr.forEach(item => {
        rows.push({
          type,
          name: item.name || '',
          email: item.email || '',
          mobile: item.mobile || item.phone || '',
          createdAt: item.createdAt || '',
        });
      });
    };
    addRows(gst, 'GST Filing');
    addRows(gstReturn, 'GST Return Filing');
    addRows(gstResolution, 'GST Resolution');
    addRows(trademark, 'Trademark');
    addRows(tax, 'Tax Planning');
    addRows(business, 'Business Advisory');
    addRows(itr, 'ITR Filing');
    addRows(itrPrep, 'ITR Document Prep');
    addRows(itrRefund, 'ITR Refund Notice');

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services report', error: err.message });
  }
});

module.exports = router;
