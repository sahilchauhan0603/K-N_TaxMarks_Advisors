import React from 'react';

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Privacy" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Privacy Policy</h1>
        <p className="text-lg text-gray-600 text-center">Your privacy is important to us. Learn how we collect, use, and protect your information at K&N TaxMark Advisors.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>We do not share your personal data with third parties except as required by law.</li>
          <li>All information is stored securely and used only for service delivery and communication.</li>
          <li>You may contact us at any time to request deletion or correction of your data.</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="Privacy" className="w-full rounded-lg mt-6 shadow" />
      </div>
    </div>
  </div>
);

export default PrivacyPolicyPage;
