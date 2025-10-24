const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const userAuth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');

// User routes
router.get('/user', userAuth, billController.getUserBills);
router.post('/create-payment-order', userAuth, billController.createPaymentOrder);
router.post('/verify-payment', userAuth, billController.verifyPayment);

// Admin routes
router.get('/admin/all', adminAuth, billController.getAllBills);

module.exports = router;