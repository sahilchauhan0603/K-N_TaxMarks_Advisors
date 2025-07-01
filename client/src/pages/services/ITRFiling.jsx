import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TestimonialSection from '../../components/TestimonialSection';

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
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
              Hassle-Free <span className="text-green-600">ITR Filing</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Accurate Income Tax Return filing for individuals, firms, and companies. Our experts ensure timely, error-free submissions, maximize your eligible refunds, and keep you compliant.
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1000&q=80" 
              alt="ITR Filing Documents" 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="itr-services-section" className="mb-16">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Our ITR Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Individual Filing" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Individual & Business ITR</h3>
              </div>
              <p className="text-gray-600">
                Filing for salaried, self-employed, professionals, and businesses with expert review.
              </p>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 1 ? null : 1)}
              >
                {openForm === 1 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 1 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <ITRFilingForm type="individual" />
                </React.Suspense>
              )}
            </div>

            {/* Service Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
                  alt="Document Preparation" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Document Preparation</h3>
              </div>
              <p className="text-gray-600">
                End-to-end document collection, preparation, and review for accurate filing and maintenance.
              </p>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 2 ? null : 2)}
              >
                {openForm === 2 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 2 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <ITRDocumentPrepForm />
                </React.Suspense>
              )}
            </div>

            {/* Service Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="Refund Assistance" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Refund & Notice Handling</h3>
              </div>
              <p className="text-gray-600">
                Maximize your eligible refunds with confidence and get expert assistance for all your tax notices and queries
              </p>
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 3 ? null : 3)}
              >
                {openForm === 3 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 3 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <ITRRefundNoticeForm />
                </React.Suspense>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Let Us Handle Your ITR Filing</h3>
              <p className="text-green-100">
                Focus on your goals while our team ensures your ITR is filed accurately and on time.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 text-center"
            >
              Book Your Slot Now
            </Link>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Team
              </h3>
              <p className="text-gray-600">
                Experienced CAs and tax professionals dedicated to your compliance and savings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Filing
              </h3>
              <p className="text-gray-600">
                Never miss a deadline with our proactive reminders and prompt service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Secure & Confidential
              </h3>
              <p className="text-gray-600">
                Your data is protected with strict confidentiality and security measures.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Support
              </h3>
              <p className="text-gray-600">
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
