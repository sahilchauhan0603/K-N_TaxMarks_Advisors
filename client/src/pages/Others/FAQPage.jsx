import React from 'react';

const FAQPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn-icons-png.flaticon.com/512/545/545705.png" alt="FAQ" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to common queries about our services and support.</p>
      </div>
      <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center"><span className="mr-2">❓</span>How do I get started with K&N TaxMark Advisors?</h2>
          <p className="text-gray-700">Simply contact us through our website or call us. Our team will guide you through the process based on your needs.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center"><span className="mr-2">💼</span>What services do you offer?</h2>
          <p className="text-gray-700">We offer Tax Planning, ITR Filing, GST Filing, Business Advisory, and Trademark & Legal services.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center"><span className="mr-2">📞</span>How can I contact support?</h2>
          <p className="text-gray-700">You can email us at kntaxmarkadvisors@gmail.com or call +91 9318469138 for support.</p>
        </div>
      </div>
    </div>
  </div>
);

export default FAQPage;
