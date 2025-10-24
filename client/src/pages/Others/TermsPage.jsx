import React, { useState, useEffect } from 'react';
import OthersContactModal from "../../components/OthersContactModal";

const TermsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className={`flex flex-col items-center mb-12 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 border-2 border-blue-200">
            <svg className="w-14 h-14 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm7-5c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1zm-7 9c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 text-center">Terms of Service</h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl">By using K&N TaxMark Advisors, you agree to our terms and conditions. Please read them carefully.</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: September 10, 2025</p>
        </div>

        {/* Main Content */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="p-8 md:p-10">
            {/* Introduction */}
            <div className="opacity-0 animate-fade-in mb-8" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <p className="text-gray-600 leading-relaxed">
                Welcome to K&N TaxMark Advisors. These Terms of Service govern your use of our website and services. 
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {/* Section 1 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">1. Services Overview</h2>
                    <p className="text-gray-600 leading-relaxed">
                      K&N TaxMark Advisors provides tax consultation, filing services, GST services, business advisory, 
                      and trademark registration services. All services are provided as per Indian law and regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">2. Client Responsibilities</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Clients are responsible for providing accurate, complete, and timely information necessary for us to perform our services. 
                      You acknowledge that incomplete or inaccurate information may affect the quality and timeliness of our services.
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Provide all required documents in a timely manner</li>
                      <li>Ensure information provided is accurate and complete</li>
                      <li>Notify us of any changes to your information</li>
                      <li>Adhere to deadlines for submissions and payments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">3. Fees and Payments</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Our service fees are as quoted at the time of engagement. Unless otherwise stated, all fees are exclusive of applicable taxes. 
                      Payment is due as per the agreed schedule, and late payments may incur additional charges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">4. Confidentiality</h2>
                    <p className="text-gray-600 leading-relaxed">
                      We maintain the confidentiality of all client information in accordance with our Privacy Policy and applicable laws. 
                      However, we may disclose information when required by law or with your consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Our liability is limited to the fees paid for our services. We are not liable for indirect, special, 
                      or consequential damages arising from the use of our services or inability to use our services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">6. Modifications to Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                      We reserve the right to update these Terms of Service at any time. Continued use of our services after changes 
                      constitutes acceptance of the modified terms. We will notify clients of significant changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">7. Governing Law</h2>
                    <p className="text-gray-600 leading-relaxed">
                      These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of 
                      the courts located in [Your City], India.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceptance Section */}
            <div className="mt-10 pt-8 border-t border-gray-200 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h3>
              <p className="text-gray-600">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please discontinue use of our services.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl overflow-hidden mt-8 shadow-md opacity-0 animate-fade-in" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="p-6 bg-blue-50 flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Questions about our Terms?</h3>
                  <p className="text-gray-600">Contact our legal team for clarification or more information.</p>
                </div>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="mt-4 md:mt-0 cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:-translate-y-1"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-gray-500 text-sm opacity-0 animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <p>© 2023 K&N TaxMark Advisors. All rights reserved.</p>
        </div>
      </div>

      {/* Contact Modal */}
      <OthersContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        source="terms"
        title="Questions About Our Terms?"
      />
    </div>
  );
};

export default TermsPage;