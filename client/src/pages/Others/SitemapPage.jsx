import React from 'react';

const SitemapPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="Sitemap" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Sitemap</h1>
        <p className="text-lg text-gray-600 text-center">Quick links to all important pages and services at K&N TaxMark Advisors.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Home</li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li>Services
            <ul className="list-disc pl-6">
              <li>Tax Planning</li>
              <li>ITR Filing</li>
              <li>GST Filing</li>
              <li>Business Advisory</li>
              <li>Trademark & Legal</li>
            </ul>
          </li>
          <li>FAQ</li>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Cookie Policy</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Sitemap" className="w-full rounded-lg mt-6 shadow" />
      </div>
    </div>
  </div>
);

export default SitemapPage;
