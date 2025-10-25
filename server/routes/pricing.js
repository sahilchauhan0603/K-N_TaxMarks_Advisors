const express = require('express');
const router = express.Router();
const {
  initializePricing,
  getAllServicePricing,
  getServicePrice,
  updateServicePrice,
  createServicePricing,
  deleteServicePricing,
  bulkUpdatePricing
} = require('../controllers/pricingController');
const adminAuth = require('../middleware/adminAuth');

// Initialize pricing data (public route for setup)
router.post('/initialize', initializePricing);

// Get all service pricing (public for frontend display)
router.get('/', getAllServicePricing);

// Get specific service price (public for frontend display)
router.get('/:category/:type', getServicePrice);

// Protected admin routes
router.use(adminAuth); // All routes below require admin authentication

// Update service price
router.put('/:id', updateServicePrice);

// Create new service pricing
router.post('/', createServicePricing);

// Delete service pricing
router.delete('/:id', deleteServicePricing);

// Bulk update pricing
router.put('/bulk/update', bulkUpdatePricing);

module.exports = router;