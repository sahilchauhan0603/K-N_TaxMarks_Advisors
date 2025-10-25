const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const cleanupPricingData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing pricing data that might have validation issues
    const ServicePricing = require('./models/ServicePricing');
    
    console.log('🗑️ Clearing existing pricing data...');
    const deleteResult = await ServicePricing.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing records`);

    // Test creating a new record with the fixed schema
    console.log('🧪 Testing new record creation...');
    const testService = new ServicePricing({
      serviceCategory: 'itr',
      serviceType: 'test_service',
      serviceName: 'Test Service',
      price: 1000,
      createdBy: 'system',
      updatedBy: 'system'
    });

    await testService.save();
    console.log('   ✅ Test record created successfully');

    // Clean up test record
    await ServicePricing.deleteOne({ serviceType: 'test_service' });
    console.log('   🗑️ Test record cleaned up');

    console.log('✅ Database is ready for pricing system');
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

cleanupPricingData();