// Service Pricing Configuration - Backend
const SERVICE_PRICING = {
  // ITR Filing Services
  itr: {
    filing: { individual: 2499, business: 4999 },
    refundNotice: 3499,
    documentPrep: 1999,
  },
  
  // GST Services
  gst: {
    filing: 1999,
    returnFiling: 2999,
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
    yearRound: 6999,
    personalCorporate: 8999,
    compliance: 4999,
  },
};

// Service display names and pricing mapping
const SERVICE_DISPLAY_MAPPING = [
  // ITR Services
  { 
    category: 'ITR Filing',
    services: [
      { name: 'ITR Filing (Individual)', price: SERVICE_PRICING.itr.filing.individual, serviceType: 'itr_filing_individual' },
      { name: 'ITR Filing (Business)', price: SERVICE_PRICING.itr.filing.business, serviceType: 'itr_filing_business' },
      { name: 'ITR Refund & Notice Handling', price: SERVICE_PRICING.itr.refundNotice, serviceType: 'itr_refund_notice' },
      { name: 'ITR Document Preparation', price: SERVICE_PRICING.itr.documentPrep, serviceType: 'itr_document_prep' },
    ]
  },
  // GST Services
  {
    category: 'GST Services',
    services: [
      { name: 'GST Filing', price: SERVICE_PRICING.gst.filing, serviceType: 'gst_filing' },
      { name: 'GST Return Filing', price: SERVICE_PRICING.gst.returnFiling, serviceType: 'gst_return_filing' },
      { name: 'GST Resolution', price: SERVICE_PRICING.gst.resolution, serviceType: 'gst_resolution' },
    ]
  },
  // Trademark Services
  {
    category: 'Trademark Services',
    services: [
      { name: 'Trademark Search & Registration', price: SERVICE_PRICING.trademark.search, serviceType: 'trademark_search' },
      { name: 'IP Protection & Dispute Resolution', price: SERVICE_PRICING.trademark.protection, serviceType: 'trademark_protection' },
      { name: 'Legal Documentation & Compliance', price: SERVICE_PRICING.trademark.documentation, serviceType: 'trademark_documentation' },
    ]
  },
  // Business Advisory Services
  {
    category: 'Business Advisory',
    services: [
      { name: 'Startup & MSME Registration', price: SERVICE_PRICING.business.startup, serviceType: 'business_startup' },
      { name: 'Company Incorporation', price: SERVICE_PRICING.business.incorporation, serviceType: 'business_incorporation' },
      { name: 'Legal & Financial Advisory', price: SERVICE_PRICING.business.advisory, serviceType: 'business_advisory' },
    ]
  },
  // Tax Planning Services
  {
    category: 'Tax Planning',
    services: [
      { name: 'Year-round Tax Strategies', price: SERVICE_PRICING.tax.yearRound, serviceType: 'tax_year_round' },
      { name: 'Personal & Corporate Tax Planning', price: SERVICE_PRICING.tax.personalCorporate, serviceType: 'tax_personal_corporate' },
      { name: 'Tax Compliance & Advisory', price: SERVICE_PRICING.tax.compliance, serviceType: 'tax_compliance' },
    ]
  },
];

// Helper function to get price for a service
const getServicePrice = (serviceName, variant = 'standard') => {
  const service = SERVICE_PRICING[serviceName];
  if (!service) return null;
  
  // Handle nested structure
  if (typeof service[variant] === 'object') {
    return service[variant];
  }
  
  return service[variant] || null;
};

// Helper function to format price
const formatPrice = (price) => {
  if (!price) return 'Contact for pricing';
  if (typeof price === 'object') {
    // For ITR filing which has individual/business options
    return `₹${price.individual?.toLocaleString()} - ₹${price.business?.toLocaleString()}`;
  }
  return `₹${price.toLocaleString()}`;
};

// Helper function to get all services for admin display
const getAllServicesForAdmin = () => {
  return SERVICE_DISPLAY_MAPPING.flatMap(category => 
    category.services.map(service => ({
      ...service,
      category: category.category,
      formattedPrice: formatPrice(service.price)
    }))
  );
};

// Default service pricing data for seeding
const getDefaultPricingData = () => {
  const baseData = [
    // ITR Services
    { serviceCategory: 'itr', serviceType: 'filing_individual', serviceName: 'ITR Filing (Individual)', price: 2499 },
    { serviceCategory: 'itr', serviceType: 'filing_business', serviceName: 'ITR Filing (Business)', price: 4999 },
    { serviceCategory: 'itr', serviceType: 'refund_notice', serviceName: 'ITR Refund & Notice Handling', price: 3499 },
    { serviceCategory: 'itr', serviceType: 'document_prep', serviceName: 'ITR Document Preparation', price: 1999 },
    
    // GST Services
    { serviceCategory: 'gst', serviceType: 'filing', serviceName: 'GST Filing', price: 1999 },
    { serviceCategory: 'gst', serviceType: 'return_filing', serviceName: 'GST Return Filing', price: 2999 },
    { serviceCategory: 'gst', serviceType: 'resolution', serviceName: 'GST Resolution', price: 3999 },
    
    // Trademark Services
    { serviceCategory: 'trademark', serviceType: 'search', serviceName: 'Trademark Search & Registration', price: 5999 },
    { serviceCategory: 'trademark', serviceType: 'protection', serviceName: 'IP Protection & Dispute Resolution', price: 12999 },
    { serviceCategory: 'trademark', serviceType: 'documentation', serviceName: 'Legal Documentation & Compliance', price: 8999 },
    
    // Business Advisory Services
    { serviceCategory: 'business', serviceType: 'startup', serviceName: 'Startup & MSME Registration', price: 7999 },
    { serviceCategory: 'business', serviceType: 'incorporation', serviceName: 'Company Incorporation', price: 15999 },
    { serviceCategory: 'business', serviceType: 'advisory', serviceName: 'Legal & Financial Advisory', price: 9999 },
    
    // Tax Planning Services
    { serviceCategory: 'tax', serviceType: 'year_round', serviceName: 'Year-round Tax Strategies', price: 6999 },
    { serviceCategory: 'tax', serviceType: 'personal_corporate', serviceName: 'Personal & Corporate Tax Planning', price: 8999 },
    { serviceCategory: 'tax', serviceType: 'compliance', serviceName: 'Tax Compliance & Advisory', price: 4999 },
  ];

  // Add default system fields to each service
  return baseData.map(service => ({
    ...service,
    createdBy: 'system',
    updatedBy: 'system',
    isActive: true
  }));
};

module.exports = {
  SERVICE_PRICING,
  SERVICE_DISPLAY_MAPPING,
  getServicePrice,
  formatPrice,
  getAllServicesForAdmin,
  getDefaultPricingData
};