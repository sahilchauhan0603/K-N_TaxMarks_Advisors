import React from 'react';

const BusinessAdvisory = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-700 mb-6">Business Advisory</h1>
      <p className="text-lg text-gray-700 mb-6">From startup registration to company incorporation and ongoing legal advisory, our business advisory services help you grow and stay compliant at every stage.</p>
      <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
        <li>Startup & MSME Registration</li>
        <li>Company Incorporation</li>
        <li>Business Structuring & Compliance</li>
        <li>Legal & Financial Advisory</li>
      </ul>
      <div className="bg-pink-100 p-6 rounded-xl shadow text-pink-800 font-semibold">Let us help you build and scale your business. Book a strategy session now!</div>
    </div>
  </div>
);

export default BusinessAdvisory;
