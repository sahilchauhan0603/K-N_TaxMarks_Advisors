import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
const TaxPlanningPersonalCorporateForm = React.lazy(() => import('./TaxPlanningPersonalCorporateForm'));
const TaxPlanningYearRoundForm = React.lazy(() => import('./TaxPlanningYearRoundForm'));
const TaxPlanningComplianceForm = React.lazy(() => import('./TaxPlanningComplianceForm'));
import TestimonialSection from '../../../components/TestimonialSection';
import Modal from '../../../components/Modal';
import ChatbotWrapper from '../../../components/ChatbotWrapper';

const TaxPlanning = () => {
  const scrollToServices = () => {
    const section = document.getElementById('tax-services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { isAuthenticated } = useAuth();
  const [openForm, setOpenForm] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
              ✓ Trusted by 700+ Clients
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
              Maximize Your <span className="text-blue-600">Tax Savings</span>
            </h1>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Maximize your savings and minimize liabilities with our expert tax planning services. We provide personalized strategies for individuals, startups, and businesses.
            </p>
            
            {/* Key Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Strategic Tax Optimization & Compliance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Year-Round Advisory & Investment Guidance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Personalized Strategies for Maximum Savings</span>
              </div>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow cursor-pointer transition-all duration-200"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Tax planning and financial strategy" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="tax-services-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Tax Planning Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Service Card 1 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Personal Tax" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Personal & Corporate Tax</h3>
                  <p className="text-sm text-gray-600">
                    Strategic tax planning for individuals and businesses to optimize savings and compliance.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 1 ? null : 1)}
              >
                {openForm === 1 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal isOpen={isAuthenticated && openForm === 1} onClose={() => setOpenForm(null)} width="max-w-2xl" minHeight="min-h-[450px]">
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningPersonalCorporateForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448558.png" 
                  alt="Tax Saving" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Year-round Strategies</h3>
                  <p className="text-sm text-gray-600">
                    Stay ahead with ongoing tax-saving strategies and investment guidance to maximize your financial benefits
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 2 ? null : 2)}
              >
                {openForm === 2 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal isOpen={isAuthenticated && openForm === 2} onClose={() => setOpenForm(null)} width="max-w-2xl" minHeight="min-h-[450px]">
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningYearRoundForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="Compliance" 
                  className="w-10 h-10 mt-0.5" 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Tax Compliance & Advisory</h3>
                  <p className="text-sm text-gray-600">
                    Expert advice and compliance support for all your tax-related needs.
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setOpenForm(openForm === 3 ? null : 3)}
              >
                {openForm === 3 ? 'Close Form' : 'Apply Now'}
              </button>
              <Modal isOpen={isAuthenticated && openForm === 3} onClose={() => setOpenForm(null)} width="max-w-2xl" minHeight="min-h-[450px]">
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningComplianceForm onClose={() => setOpenForm(null)} />
                </React.Suspense>
              </Modal>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 shadow text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold mb-2">Start Planning Your Financial Future</h3>
              <p className="text-sm text-blue-50 opacity-95">
                Contact us for a free consultation and personalized tax planning strategies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <ChatbotWrapper 
                serviceName="Tax Planning" 
                buttonClassName="bg-white text-blue-700 hover:bg-blue-50" 
              />
              <Link
                to="/contact-us"
                className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-colors duration-200 text-center whitespace-nowrap"
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
                <svg className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Team
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Experienced tax professionals dedicated to maximizing your savings.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Advice
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Proactive, year-round support for all your tax planning needs.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Confidential & Secure
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your financial data is protected with strict confidentiality and security.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Guidance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From planning to compliance, we support your financial journey.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialSection service="Tax Planning" />
      </div>
    </div>
  );
};

export default TaxPlanning;
