import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const TaxPlanningPersonalCorporateForm = React.lazy(() => import('./TaxPlanningPersonalCorporateForm'));
const TaxPlanningYearRoundForm = React.lazy(() => import('./TaxPlanningYearRoundForm'));
const TaxPlanningComplianceForm = React.lazy(() => import('./TaxPlanningComplianceForm'));
import TestimonialSection from '../../components/TestimonialSection';

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
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
              Maximize Your <span className="text-blue-600">Tax Savings</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Maximize your savings and minimize liabilities with our expert tax planning services. We provide personalized strategies for individuals, startups, and businesses to ensure compliance and optimal tax outcomes.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" 
              alt="Tax Planning" 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="tax-services-section" className="mb-16">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Our Tax Planning Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Personal Tax" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Personal & Corporate Tax</h3>
              </div>
              <p className="text-gray-600">
                Strategic tax planning for individuals and businesses to optimize savings and compliance.
              </p>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 1 ? null : 1)}
              >
                {openForm === 1 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 1 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningPersonalCorporateForm />
                </React.Suspense>
              )}
            </div>
            {/* Service Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448558.png" 
                  alt="Tax Saving" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Year-round Strategies</h3>
              </div>
              <p className="text-gray-600">
                Stay ahead with ongoing tax-saving strategies and investment guidance to maximize your financial benefits
              </p>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 2 ? null : 2)}
              >
                {openForm === 2 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 2 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningYearRoundForm />
                </React.Suspense>
              )}
            </div>
            {/* Service Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="Compliance" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Tax Compliance & Advisory</h3>
              </div>
              <p className="text-gray-600">
                Expert advice and compliance support for all your tax-related needs.
              </p>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 3 ? null : 3)}
              >
                {openForm === 3 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 3 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <TaxPlanningComplianceForm />
                </React.Suspense>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Start Planning Your Financial Future</h3>
              <p className="text-blue-100">
                Contact us for a free consultation and personalized tax planning strategies.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 text-center"
            >
              Free Consultation
            </Link>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Team
              </h3>
              <p className="text-gray-600">
                Experienced tax professionals dedicated to maximizing your savings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Advice
              </h3>
              <p className="text-gray-600">
                Proactive, year-round support for all your tax planning needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Confidential & Secure
              </h3>
              <p className="text-gray-600">
                Your financial data is protected with strict confidentiality and security.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Guidance
              </h3>
              <p className="text-gray-600">
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
