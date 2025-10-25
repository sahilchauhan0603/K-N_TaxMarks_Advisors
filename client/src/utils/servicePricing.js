import { useState, useEffect } from 'react';
import axios from './axios';

// Service Pricing Configuration (Fallback)
export const SERVICE_PRICING = {
  // ITR Filing Services
  itr: {
    filing_individual: 2499,
    filing_business: 4999,
    refund_notice: 3499,
    document_prep: 1999,
  },
  
  // GST Services
  gst: {
    filing: 1999,
    return_filing: 2999,
    resolution: 3999,
  },
  
  // Trademark Services
  trademark: {
    search: 5999,
    protection: 12999,
    documentation: 8999,
  },
  
  // Business Advisory Services
  business: {
    startup: 7999,
    incorporation: 15999,
    advisory: 9999,
  },
  
  // Tax Planning Services
  tax: {
    year_round: 6999,
    personal_corporate: 8999,
    compliance: 4999,
  },
};

// Helper function to get service price by category and type (returns raw price)
export const getServicePrice = (category, serviceType) => {
  const categoryPricing = SERVICE_PRICING[category];
  if (!categoryPricing) return null;
  
  return categoryPricing[serviceType] || null;
};

// Helper function to get formatted service price
export const getFormattedServicePrice = (category, serviceType) => {
  const price = getServicePrice(category, serviceType);
  return price ? formatPrice(price) : 'Contact for pricing';
};

// Async helper to get price from API (with fallback)
export const getServicePriceFromAPI = async (category, serviceType) => {
  try {
    console.log(`Fetching price for ${category}/${serviceType}`);
    
    const response = await axios.get(`/api/pricing/${category}/${serviceType}`);
    
    console.log('API response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data.price; // Return raw price, not formatted
    } else {
      console.log('Unexpected API response structure:', response.data);
    }
  } catch (error) {
    console.log('API pricing error:', error.message);
    if (error.response) {
      console.log('Error response:', error.response.status, error.response.data);
    }
  }
  
  // Fallback to static pricing
  console.log(`Using fallback pricing for ${category}/${serviceType}`);
  return getServicePrice(category, serviceType);
};

// Hook for reactive pricing that updates when admin changes prices
export const useServicePrice = (category, serviceType) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrice = async () => {
    console.log(`useServicePrice: Fetching ${category}/${serviceType}`);
    setLoading(true);
    try {
      const apiPrice = await getServicePriceFromAPI(category, serviceType);
      console.log(`useServicePrice: Got price ${apiPrice} for ${category}/${serviceType}`);
      setPrice(apiPrice);
    } catch (error) {
      console.error('Error fetching price:', error);
      const fallbackPrice = getServicePrice(category, serviceType);
      console.log(`useServicePrice: Using fallback ${fallbackPrice} for ${category}/${serviceType}`);
      setPrice(fallbackPrice);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [category, serviceType]);

  // Listen for pricing updates (when admin changes prices)
  useEffect(() => {
    const handlePriceUpdate = (event) => {
      if (event.detail?.category === category && event.detail?.serviceType === serviceType) {
        fetchPrice();
      }
    };

    window.addEventListener('priceUpdated', handlePriceUpdate);
    return () => {
      window.removeEventListener('priceUpdated', handlePriceUpdate);
    };
  }, [category, serviceType]);

  return { price, loading, formattedPrice: price ? formatPrice(price) : 'Contact for pricing' };
};

// Helper function to format price
export const formatPrice = (price) => {
  if (!price) return 'Contact for pricing';
  return `₹${price.toLocaleString('en-IN')}`;
};

// Helper function to get all service prices for a category
export const getCategoryPrices = (category) => {
  const categoryPricing = SERVICE_PRICING[category];
  if (!categoryPricing) return [];
  
  return Object.entries(categoryPricing).map(([serviceType, price]) => ({
    serviceType,
    price,
    formattedPrice: formatPrice(price),
  }));
};