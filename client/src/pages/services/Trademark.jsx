import React from 'react';
import { Link } from 'react-router-dom';

const Trademark = () => {
  const scrollToServices = () => {
    const section = document.getElementById('trademark-services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-6">
              Protect Your <span className="text-purple-600">Brand</span> with Trademark & Legal Experts
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Secure your business identity and protect your brand with our end-to-end trademark registration and legal advisory services. We guide you through every step, from application to enforcement.
            </p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              onClick={scrollToServices}
            >
              Get Started Today
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1000&q=80" 
              alt="Trademark & Legal" 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div id="trademark-services-section" className="mb-16">
          <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">Our Trademark & Legal Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Trademark Search" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Trademark Search & Registration</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive search and hassle-free registration to secure your brand identity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448558.png" 
                  alt="Legal Documentation" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">Legal Documentation & Compliance</h3>
              </div>
              <p className="text-gray-600">
                Drafting, filing, and compliance for all your intellectual property needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907555.png" 
                  alt="IP Protection" 
                  className="w-12 h-12 mr-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">IP Protection & Dispute Resolution</h3>
              </div>
              <p className="text-gray-600">
                Intellectual property protection, litigation, and dispute resolution services.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Protect Your Brand Today</h3>
              <p className="text-purple-100">
                Schedule a legal consultation and safeguard your business identity and IP.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 text-center"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Legal Experts
              </h3>
              <p className="text-gray-600">
                Experienced legal professionals for trademark and IP protection.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Timely Service
              </h3>
              <p className="text-gray-600">
                Fast, reliable, and proactive support for all your legal needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Confidential & Secure
              </h3>
              <p className="text-gray-600">
                Your legal matters are handled with strict confidentiality and care.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                End-to-End Support
              </h3>
              <p className="text-gray-600">
                From registration to enforcement, we support your brand journey.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-600 italic mb-4">
                "The trademark team made the process seamless and stress-free. Our brand is now fully protected!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/77.jpg" 
                  alt="Client" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Vikram Jain</p>
                  <p className="text-sm text-gray-500">Brand Owner</p>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-600 italic mb-4">
                "Professional, knowledgeable, and always available for queries. Highly recommend their legal services."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/53.jpg" 
                  alt="Client" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Priya Nair</p>
                  <p className="text-sm text-gray-500">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trademark;
