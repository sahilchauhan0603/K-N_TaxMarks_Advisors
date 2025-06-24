import React from 'react';

const TermsPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" alt="Terms" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Terms of Service</h1>
        <p className="text-lg text-gray-600 text-center">By using K&N TaxMark Advisors, you agree to our terms and conditions. Please read them carefully.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>All services are provided as per Indian law and regulations.</li>
          <li>Clients are responsible for providing accurate and timely information.</li>
          <li>We reserve the right to update these terms at any time.</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Terms" className="w-full rounded-lg mt-6 shadow" />
      </div>
    </div>
  </div>
);

export default TermsPage;
