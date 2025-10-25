import React, { useState, useEffect } from 'react';
import { useServicePrice } from '../../../utils/servicePricing';
import axios from '../../../utils/axios';

const PricingDebug = () => {
  const [apiTest, setApiTest] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Test the useServicePrice hook
  const { price, loading: hookLoading, formattedPrice } = useServicePrice('gst', 'filing');
  
  const testApiDirectly = async () => {
    setLoading(true);
    try {
      console.log('Testing API directly...');
      const response = await axios.get('/api/pricing/gst/filing');
      console.log('Direct API response:', response.data);
      setApiTest(response.data);
    } catch (error) {
      console.error('Direct API error:', error);
      setApiTest({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAllPricing = async () => {
    try {
      console.log('Testing all pricing endpoint...');
      const response = await axios.get('/api/pricing');
      console.log('All pricing response:', response.data);
    } catch (error) {
      console.error('All pricing error:', error);
    }
  };

  useEffect(() => {
    // Test on component mount
    testApiDirectly();
    testAllPricing();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4">Pricing System Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">useServicePrice Hook Test:</h3>
          <p>Loading: {hookLoading ? 'Yes' : 'No'}</p>
          <p>Raw Price: {price}</p>
          <p>Formatted Price: {formattedPrice}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Direct API Test:</h3>
          <button 
            onClick={testApiDirectly}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          {apiTest && (
            <pre className="bg-white p-2 rounded mt-2 text-sm">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingDebug;