const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  sendOTP,
  verifyOTP,
  getAllUsers,
  deleteUser,
  getDashboardStats,
  exportUsersExcel,
  exportServicesExcel,
  getServicesReport
} = require("../controllers/adminController");

// Send OTP endpoint
router.post("/send-otp", sendOTP);

// Verify OTP endpoint
router.post("/verify-otp", verifyOTP);

// Get all users (admin only)
router.get("/users", adminAuth, getAllUsers);

// Delete user (admin only)
router.delete("/users/:id", adminAuth, deleteUser);

// Dashboard stats endpoint
router.get("/dashboard-stats", adminAuth, getDashboardStats);


// Export users to Excel
router.get('/export-users-excel', adminAuth, exportUsersExcel);

// Export services to Excel
router.get('/export-services-excel', adminAuth, exportServicesExcel);

// Return all services data as JSON for frontend table
router.get('/services-report', adminAuth, getServicesReport);

module.exports = router;
