const ServicePricing = require('../models/ServicePricing');
const { getDefaultPricingData, getAllServicesForAdmin } = require('../config/servicePricing');

// Seed default pricing data
const seedDefaultPricing = async () => {
  try {
    const count = await ServicePricing.countDocuments();
    if (count === 0) {
      console.log('Seeding default pricing data...');
      const defaultData = getDefaultPricingData();
      await ServicePricing.insertMany(defaultData);
      console.log('Default pricing data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding pricing data:', error);
  }
};

// Initialize pricing data
const initializePricing = async (req, res) => {
  try {
    await seedDefaultPricing();
    res.status(200).json({
      success: true,
      message: 'Pricing data initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing pricing data',
      error: error.message
    });
  }
};

// Get all service pricing
const getAllServicePricing = async (req, res) => {
  try {
    // Seed data if empty
    await seedDefaultPricing();
    
    const pricingData = await ServicePricing.find({})
      .sort({ serviceCategory: 1, serviceName: 1 })
      .select('serviceCategory serviceType serviceName price isActive');

    // Group by category for better organization
    const groupedPricing = pricingData.reduce((acc, service) => {
      const category = service.serviceCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        grouped: groupedPricing,
        all: pricingData
      }
    });
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing data',
      error: error.message
    });
  }
};

// Get specific service price
const getServicePrice = async (req, res) => {
  try {
    const { category, type } = req.params;
    
    const service = await ServicePricing.findOne({
      serviceCategory: category,
      serviceType: type,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service pricing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service price:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service price',
      error: error.message
    });
  }
};

// Update service price
const updateServicePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, serviceName, isActive } = req.body;

    // Validate price
    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price value'
      });
    }

    const updateData = {};
    if (price !== undefined) updateData.price = price;
    if (serviceName) updateData.serviceName = serviceName;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    updateData.updatedBy = req.user?.id || 'admin';
    updateData.lastUpdatedAt = new Date();

    const updatedService = await ServicePricing.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service price updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Error updating service price:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service price',
      error: error.message
    });
  }
};

// Create new service pricing
const createServicePricing = async (req, res) => {
  try {
    const { serviceCategory, serviceType, serviceName, price } = req.body;

    // Validate required fields
    if (!serviceCategory || !serviceType || !serviceName || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: serviceCategory, serviceType, serviceName, price'
      });
    }

    // Check for duplicate
    const existingService = await ServicePricing.findOne({
      serviceCategory,
      serviceType
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service pricing already exists for this category and type'
      });
    }

    const newService = new ServicePricing({
      serviceCategory,
      serviceType,
      serviceName,
      price,
      createdBy: req.user?.id || 'admin',
      updatedBy: req.user?.id || 'admin'
    });

    await newService.save();

    res.status(201).json({
      success: true,
      message: 'Service pricing created successfully',
      data: newService
    });
  } catch (error) {
    console.error('Error creating service pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service pricing',
      error: error.message
    });
  }
};

// Delete service pricing
const deleteServicePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await ServicePricing.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service pricing deleted successfully',
      data: deletedService
    });
  } catch (error) {
    console.error('Error deleting service pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service pricing',
      error: error.message
    });
  }
};

// Bulk update pricing
const bulkUpdatePricing = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: {
          price: update.price,
          updatedBy: req.user?.id || 'admin',
          lastUpdatedAt: new Date()
        }
      }
    }));

    const result = await ServicePricing.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} services`,
      data: result
    });
  } catch (error) {
    console.error('Error bulk updating pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating pricing',
      error: error.message
    });
  }
};

module.exports = {
  initializePricing,
  getAllServicePricing,
  getServicePrice,
  updateServicePrice,
  createServicePricing,
  deleteServicePricing,
  bulkUpdatePricing,
  seedDefaultPricing
};