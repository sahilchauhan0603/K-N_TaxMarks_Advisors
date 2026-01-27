import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import TestimonialSection from '../../../components/TestimonialSection';
import Modal from '../../../components/Modal';
import ChatbotWrapper from '../../../components/ChatbotWrapper';

const ITRFilingForm = React.lazy(() => import('./ITRFilingForm'));
const ITRDocumentPrepForm = React.lazy(() => import('./ITRDocumentPrepForm'));
const ITRRefundNoticeForm = React.lazy(() => import('./ITRRefundNoticeForm'));

const ITRFiling = () => {
  const { isAuthenticated } = useAuth();
  const [openForm, setOpenForm] = useState(null); // which form is open

  // Scroll to services section
  const scrollToServices = () => {
    const section = document.getElementById('itr-services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
              ✓ Trusted by 1000+ Taxpayers
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
              Hassle-Free <span className="text-green-600">ITR Filing</span>
            </h1>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Accurate Income Tax Return filing for individuals, firms, and companies. Our experts ensure timely, error-free submissions and maximize your eligible refunds.
            </p>
            
            {/* Key Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Expert CA Review & Error-Free Filing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Maximum Refund & Tax Savings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Notice Support & Refund Tracking</span>
              </div>
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow cursor-pointer transition-all duration-200"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Income tax return filing" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="itr-services-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our ITR Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Individual Filing" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Individual & Business ITR</h3>
                  <p className="text-sm text-gray-600">
                    Filing for salaried, self-employed, professionals, and businesses with expert review.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 1 ? null : 1)}
              >
                {openForm === 1 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal 
                isOpen={isAuthenticated && openForm === 1} 
                onClose={() => setOpenForm(null)} 
                width="max-w-2xl" 
                minHeight="min-h-[450px]"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-[450px]">
                    <div className="text-blue-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <ITRFilingForm type="individual" onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
                  alt="Document Preparation" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Document Preparation</h3>
                  <p className="text-sm text-gray-600">
                    End-to-end document collection, preparation, and review for accurate filing and maintenance.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 2 ? null : 2)}
              >
                {openForm === 2 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal 
                isOpen={isAuthenticated && openForm === 2} 
                onClose={() => setOpenForm(null)} 
                width="max-w-2xl" 
                minHeight="min-h-[450px]"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-[450px]">
                    <div className="text-blue-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <ITRDocumentPrepForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="Refund Assistance" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Refund & Notice Handling</h3>
                  <p className="text-sm text-gray-600">
                    Maximize your eligible refunds with confidence and get expert assistance for all your tax notices and queries
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 3 ? null : 3)}
              >
                {openForm === 3 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal 
                isOpen={isAuthenticated && openForm === 3} 
                onClose={() => setOpenForm(null)} 
                width="max-w-2xl" 
                minHeight="min-h-[450px]"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-[450px]">
                    <div className="text-blue-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <ITRRefundNoticeForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 shadow text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold mb-2">Get Instant ITR Help & Expert Support</h3>
              <p className="text-sm text-green-50 opacity-95 mb-1.5">
                <span className="font-medium">🤖 AI Assistant:</span> Get immediate answers to ITR queries, filing guidance, and tax deduction tips 24/7
              </p>
              <p className="text-sm text-green-50 opacity-95">
                <span className="font-medium">👨‍💼 Expert Consultation:</span> Connect with our certified tax professionals for personalized ITR solutions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <ChatbotWrapper serviceName="ITR Filing" buttonClassName="bg-white text-green-700 hover:bg-green-50"  />
              <Link
                to="/contact-us"
                className="bg-green-800 hover:bg-green-900 text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-colors duration-200 text-center whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Team
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Experienced CAs and tax professionals dedicated to your compliance and savings.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Filing
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Never miss a deadline with our proactive reminders and prompt service.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Secure & Confidential
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data is protected with strict confidentiality and security measures.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From document collection to refund tracking, we handle it all for you.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialSection service="ITR Filing" />
      </div>
    </div>
  );
};

export default ITRFiling;
