import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const GSTFilingForm = React.lazy(() => import('./GSTFilingForm'));
const GSTReturnFilingForm = React.lazy(() => import('./GSTReturnFilingForm'));
const GSTResolutionForm = React.lazy(() => import('./GSTResolutionForm'));

const GSTFiling = () => {
  // Scroll to services section
  const scrollToServices = () => {
    const section = document.getElementById('gst-services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { isAuthenticated } = useAuth();
  const [openForm, setOpenForm] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-700 mb-6">
              Simplify Your <span className="text-yellow-600">GST Compliance</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Timely GST registration, filing, return reconciliation, and expert resolution services. 
              Stay compliant and avoid penalties with our professional GST solutions tailored for businesses of all sizes.
            </p>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Tax documents and calculator" 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="gst-services-section" className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">Our GST Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" 
                  alt="Registration" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Registration & Amendments</h3>
              </div>
              <p className="text-gray-600">
                Hassle-free GST registration and seamless amendments to keep your business compliant.
              </p>
              <button
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 1 ? null : 1)}
              >
                {openForm === 1 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 1 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <GSTFilingForm />
                </React.Suspense>
              )}
            </div>

            {/* Service Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448558.png" 
                  alt="Filing" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Return Filing</h3>
              </div>
              <p className="text-gray-600">
                Accurate monthly/quarterly GST return filing to ensure compliance and maximize input tax credits.
              </p>
              <button
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 2 ? null : 2)}
              >
                {openForm === 2 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 2 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <GSTReturnFilingForm />
                </React.Suspense>
              )}
            </div>

            {/* Service Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1570/1570887.png" 
                  alt="Reconciliation" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">ITC Reconciliation</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive input tax credit reconciliation to optimize your tax savings and compliance.
              </p>
              <button
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                onClick={() => setOpenForm(openForm === 3 ? null : 3)}
              >
                {openForm === 3 ? 'Close Form' : 'Apply Now'}
              </button>
              {isAuthenticated && openForm === 3 && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                  <GSTResolutionForm />
                </React.Suspense>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Need Expert GST Assistance?</h3>
              <p className="text-yellow-100">
                Our team of GST professionals is ready to handle all your compliance needs, 
                saving you time and ensuring accuracy.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="bg-white text-yellow-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 text-center"
            >
              Contact Us Now
            </Link>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Our team of certified GST practitioners provides accurate and up-to-date advice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Filing
              </h3>
              <p className="text-gray-600">
                Never miss a deadline with our proactive reminders and timely filing services.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Secure Processing
              </h3>
              <p className="text-gray-600">
                Your financial data is protected with bank-level security measures.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                Cloud Access
              </h3>
              <p className="text-gray-600">
                Access your GST documents anytime, anywhere through our secure portal.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-gray-600 italic mb-4">
                "The team made GST compliance so simple for our startup. We've saved countless hours and avoided penalties thanks to their timely reminders."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="Client" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Priya Sharma</p>
                  <p className="text-sm text-gray-500">Founder, TechSolutions</p>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-gray-600 italic mb-4">
                "Their reconciliation service helped us recover significant input tax credits we didn't even know we were missing. Highly recommended!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Client" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Rahul Mehta</p>
                  <p className="text-sm text-gray-500">Director, RetailChain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTFiling;