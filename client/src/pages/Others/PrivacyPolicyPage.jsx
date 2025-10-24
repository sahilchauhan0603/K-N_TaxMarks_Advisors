import React, { useState, useEffect } from 'react';
import OthersContactModal from "../../components/OthersContactModal";

const PrivacyPolicyPage = () => {
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
            </svg>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 text-center">Privacy Policy</h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl">Your privacy is important to us. Learn how we collect, use, and protect your information at K&N TaxMark Advisors.</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: September 10, 2023</p>
        </div>

        {/* Main Content */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="p-8 md:p-10">
            {/* Introduction */}
            <div className="opacity-0 animate-fade-in mb-8" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <p className="text-gray-600 leading-relaxed">
                At K&N TaxMark Advisors, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {/* Section 1 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Personal identification information (Name, email address, phone number, etc.)</li>
                      <li>Business information (Company name, GST number, etc.)</li>
                      <li>Financial information necessary for tax preparation and filing</li>
                      <li>Documents required for providing our services</li>
                      <li>Communication records when you contact us</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We use the information we collect for various purposes, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Providing, maintaining, and improving our services</li>
                      <li>Processing transactions and sending related information</li>
                      <li>Responding to your comments, questions, and requests</li>
                      <li>Sending technical notices, updates, and support messages</li>
                      <li>Communicating about products, services, and promotional offers</li>
                      <li>Monitoring and analyzing trends, usage, and activities</li>
                      <li>Detecting, investigating, and preventing fraudulent transactions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">3. Information Sharing and Disclosure</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We do not share your personal data with third parties except in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>With your consent</li>
                      <li>With service providers who need access to perform services on our behalf</li>
                      <li>To comply with legal obligations or respond to lawful requests</li>
                      <li>To protect the rights, property, and safety of our company, our users, or others</li>
                      <li>In connection with a business transaction like a merger or acquisition</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Encryption of sensitive data</li>
                      <li>Regular security assessments and testing</li>
                      <li>Access controls to limit who can access your information</li>
                      <li>Secure storage systems and protocols</li>
                      <li>Employee training on data protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">5. Your Rights and Choices</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      You have certain rights regarding your personal information, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                      <li>Accessing and reviewing your information</li>
                      <li>Correcting inaccuracies in your information</li>
                      <li>Requesting deletion of your information</li>
                      <li>Objecting to or restricting certain processing activities</li>
                      <li>Withdrawing consent where we rely on consent for processing</li>
                      <li>Receiving a copy of your information in a portable format</li>
                    </ul>
                    <p className="text-gray-600 leading-relaxed">
                      To exercise these rights, please contact us using the information provided below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">6. Changes to This Policy</h2>
                    <p className="text-gray-600 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">7. Contact Us</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us at:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Email: <a href="mailto:kntaxmarkadvisors@gmail.com" className="text-blue-600 hover:underline">kntaxmarkadvisors@gmail.com</a></li>
                      <li>Phone: <a href="tel:+919318469138" className="text-blue-600 hover:underline">+91 9318469138</a></li>
                      <li>Address: [Your Company Address]</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceptance Section */}
            <div className="mt-10 pt-8 border-t border-gray-200 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Acceptance</h3>
              <p className="text-gray-600">
                By using our services, you signify your acceptance of this Privacy Policy. If you do not agree to this policy, please do not use our services. Your continued use of the services following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl overflow-hidden mt-8 shadow-md opacity-0 animate-fade-in" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="p-6 bg-blue-50 flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Questions about your privacy?</h3>
                  <p className="text-gray-600">Contact our privacy team for clarification or to exercise your rights.</p>
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
        source="privacy-policy"
        title="Questions About Your Privacy?"
      />
    </div>
  );
};

export default PrivacyPolicyPage;