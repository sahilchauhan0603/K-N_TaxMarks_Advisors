const axios = require('axios');

// Test script to initialize and verify pricing system
const testPricingSystem = async () => {
  const baseURL = 'http://localhost:8000';
  
  console.log('🚀 Testing Pricing System...\n');
  
  try {
    // 1. Initialize pricing data
    console.log('1. Initializing pricing data...');
    const initResponse = await axios.post(`${baseURL}/api/pricing/initialize`);
    console.log('   ✅ Pricing data initialized:', initResponse.data.message);
    
    // 2. Get all pricing data
    console.log('\n2. Fetching all pricing data...');
    const allPricing = await axios.get(`${baseURL}/api/pricing`);
    console.log(`   ✅ Found ${allPricing.data.data.all.length} services`);
    console.log(`   ✅ Categories: ${Object.keys(allPricing.data.data.grouped).join(', ')}`);
    
    // 3. Test specific service lookup
    console.log('\n3. Testing specific service lookup...');
    const itrService = await axios.get(`${baseURL}/api/pricing/itr/filing_individual`);
    console.log(`   ✅ ITR Individual Filing: ₹${itrService.data.data.price}`);
    
    // 4. Test price update (requires admin auth - will fail but show endpoint exists)
    console.log('\n4. Testing price update endpoint...');
    try {
      await axios.put(`${baseURL}/api/pricing/${allPricing.data.data.all[0]._id}`, {
        price: 2999
      });
      console.log('   ✅ Price update successful');
    } catch (authError) {
      if (authError.response?.status === 401 || authError.response?.status === 403) {
        console.log('   ✅ Price update endpoint exists (requires admin auth)');
      } else {
        console.log('   ❌ Price update error:', authError.message);
      }
    }
    
    console.log('\n🎉 Pricing system is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Start your React client');
    console.log('2. Login as admin');
    console.log('3. Navigate to Admin → Service Pricing');
    console.log('4. Test editing prices in the admin panel');
    
  } catch (error) {
    console.error('❌ Error testing pricing system:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your server is running on port 8000');
    }
  }
};

// Run the test
testPricingSystem();