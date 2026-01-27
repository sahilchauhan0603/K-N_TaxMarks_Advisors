import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
const BusinessAdvisoryStartupForm = React.lazy(() => import('./BusinessAdvisoryStartupForm'));
const BusinessAdvisoryIncorporationForm = React.lazy(() => import('./BusinessAdvisoryIncorporationForm'));
const BusinessAdvisoryAdvisoryForm = React.lazy(() => import('./BusinessAdvisoryAdvisoryForm'));
import TestimonialSection from '../../../components/TestimonialSection';
import Modal from '../../../components/Modal';
import ChatbotWrapper from '../../../components/ChatbotWrapper';

const BusinessAdvisory = () => {
  const { isAuthenticated } = useAuth();
  const [openForm, setOpenForm] = useState(null);

  const scrollToServices = () => {
    const section = document.getElementById('business-services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
              ✓ Trusted by 400+ Businesses
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4">
              Grow Your <span className="text-pink-600">Business</span> with Expert Advisory
            </h1>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              From startup registration to company incorporation and ongoing legal advisory, our business advisory services help you grow and stay compliant at every stage.
            </p>
            
            {/* Key Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Fast Registration & Complete Documentation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Legal & Financial Advisory Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">End-to-End Business Growth Solutions</span>
              </div>
            </div>

            <button
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow cursor-pointer transition-all duration-200"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Business advisory and growth" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="business-services-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Business Advisory Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Startup Registration" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Startup & MSME Registration</h3>
                  <p className="text-sm text-gray-600">
                    Hassle-free registration for startups and MSMEs, including all documentation and compliance.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
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
                    <div className="text-pink-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <BusinessAdvisoryStartupForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448558.png" 
                  alt="Company Incorporation" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Company Incorporation</h3>
                  <p className="text-sm text-gray-600">
                    End-to-end support for company formation, structuring, and legal compliance.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
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
                    <div className="text-pink-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <BusinessAdvisoryIncorporationForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="Advisory" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Legal & Financial Advisory</h3>
                  <p className="text-sm text-gray-600">
                    Ongoing legal, financial, and compliance advisory services to ensure smooth and hassle-free business operations.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
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
                    <div className="text-pink-600 text-lg">Loading form...</div>
                  </div>
                }>
                  <BusinessAdvisoryAdvisoryForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-6 shadow text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold mb-2">Get Instant Business Help & Expert Support</h3>
              <p className="text-sm text-pink-50 opacity-95 mb-1.5">
                <span className="font-medium">🤖 AI Assistant:</span> Get immediate answers to business queries, registration guidance, and compliance tips 24/7
              </p>
              <p className="text-sm text-pink-50 opacity-95">
                <span className="font-medium">👨‍💼 Expert Consultation:</span> Connect with our certified business advisors for personalized solutions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <ChatbotWrapper 
                serviceName="Business Advisory" 
                buttonClassName="bg-white text-pink-700 hover:bg-pink-50" 
              />
              <Link
                to="/contact-us"
                className="bg-pink-800 hover:bg-pink-900 text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-colors duration-200 text-center whitespace-nowrap"
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
                <svg className="w-5 h-5 text-pink-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Team
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Experienced professionals for business, legal, and financial advisory.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-pink-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fast, reliable, and proactive support for all your business needs.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-pink-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Confidential & Secure
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your business data is protected with strict confidentiality and security.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-pink-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Guidance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From registration to scaling, we support your business journey.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialSection service="Business Advisory" />
      </div>
    </div>
  );
};

export default BusinessAdvisory;
