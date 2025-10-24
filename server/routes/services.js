const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');

// Import all service models
const GST = require('../models/GST');
const ITR = require('../models/ITR');
const BusinessAdvisory = require('../models/BusinessAdvisory');
const TaxPlanning = require('../models/TaxPlanning');
const Trademark = require('../models/Trademark');

// Get all services for a specific user
router.get('/user-services', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const Bill = require('../models/Bill');
    
    // Fetch all services for the user
    const [gstServices, itrServices, businessServices, taxServices, trademarkServices] = await Promise.all([
      GST.find({ userId }).sort({ createdAt: -1 }),
      ITR.find({ userId }).sort({ createdAt: -1 }),
      BusinessAdvisory.find({ userId }).sort({ createdAt: -1 }),
      TaxPlanning.find({ userId }).sort({ createdAt: -1 }),
      Trademark.find({ userId }).sort({ createdAt: -1 })
    ]);

    // Function to attach bill information to services
    const attachBillInfo = async (services, serviceType) => {
      return Promise.all(services.map(async (service) => {
        const bill = await Bill.findOne({
          serviceId: service._id,
          serviceType: serviceType,
          userId: userId
        });
        
        const serviceObj = service.toObject();
        serviceObj.bill = bill; // Attach bill information
        return serviceObj;
      }));
    };

    // Attach bill information to each service type
    const [gstWithBills, itrWithBills, businessWithBills, taxWithBills, trademarkWithBills] = await Promise.all([
      attachBillInfo(gstServices, 'gst'),
      attachBillInfo(itrServices, 'itr'),
      attachBillInfo(businessServices, 'business'),
      attachBillInfo(taxServices, 'tax'),
      attachBillInfo(trademarkServices, 'trademark')
    ]);

    const userServices = {
      gst: gstWithBills,
      itr: itrWithBills,
      business: businessWithBills,
      tax: taxWithBills,
      trademark: trademarkWithBills,
      totalServices: gstWithBills.length + itrWithBills.length + businessWithBills.length + taxWithBills.length + trademarkWithBills.length
    };

    res.status(200).json({
      success: true,
      data: userServices
    });
  } catch (error) {
    console.error('Error fetching user services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user services',
      error: error.message
    });
  }
});

// Get all services (Admin only)
router.get('/all-services', async (req, res) => {
  try {
    // Fetch all services with user population
    const [gstServices, itrServices, businessServices, taxServices, trademarkServices] = await Promise.all([
      GST.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      ITR.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      BusinessAdvisory.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      TaxPlanning.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      Trademark.find().populate('userId', 'name email phone').sort({ createdAt: -1 })
    ]);

    const allServices = {
      gst: gstServices,
      itr: itrServices,
      business: businessServices,
      tax: taxServices,
      trademark: trademarkServices,
      totalServices: gstServices.length + itrServices.length + businessServices.length + taxServices.length + trademarkServices.length
    };

    res.status(200).json({
      success: true,
      data: allServices
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all services',
      error: error.message
    });
  }
});

// Get service statistics
router.get('/statistics', async (req, res) => {
  try {
    const [gstCount, itrCount, businessCount, taxCount, trademarkCount] = await Promise.all([
      GST.countDocuments(),
      ITR.countDocuments(),
      BusinessAdvisory.countDocuments(),
      TaxPlanning.countDocuments(),
      Trademark.countDocuments()
    ]);

    const statistics = {
      gst: gstCount,
      itr: itrCount,
      business: businessCount,
      tax: taxCount,
      trademark: trademarkCount,
      total: gstCount + itrCount + businessCount + taxCount + trademarkCount
    };

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;