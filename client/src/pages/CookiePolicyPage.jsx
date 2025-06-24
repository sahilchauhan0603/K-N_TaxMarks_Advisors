import React from 'react';

const CookiePolicyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png" alt="Cookies" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Cookie Policy</h1>
        <p className="text-lg text-gray-600 text-center">We use cookies to enhance your experience on our website. By using our site, you consent to our use of cookies.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Cookies help us analyze site traffic and usage.</li>
          <li>You can disable cookies in your browser settings at any time.</li>
          <li>We do not use cookies to collect sensitive personal information.</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Cookies" className="w-full rounded-lg mt-6 shadow" />
      </div>
    </div>
  </div>
);

export default CookiePolicyPage;
