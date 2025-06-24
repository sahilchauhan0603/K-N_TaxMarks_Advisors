import React from 'react';
import { FaRocket, FaUsers, FaChartLine } from 'react-icons/fa';

const AboutUsPage = () => {
  const features = [
    {
      icon: <FaRocket className="text-4xl mb-4 text-blue-600" />,
      title: "Our Mission",
      description: "To empower individuals and businesses with expert tax, legal, and business advisory services, ensuring compliance and growth."
    },
    {
      icon: <FaUsers className="text-4xl mb-4 text-green-600" />,
      title: "Who We Are",
      description: "K&N TaxMark Advisors is a team of experienced Chartered Accountants and legal professionals dedicated to providing reliable, transparent, and client-focused solutions."
    },
    {
      icon: <FaChartLine className="text-4xl mb-4 text-purple-600" />,
      title: "Our Impact",
      description: "Serving 1,000+ clients across India, we have helped startups, SMEs, and individuals achieve their financial and legal goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About <span className="text-blue-600">K&N TaxMark Advisors</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Pioneering the future of customer relationship management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                {feature.icon}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-full w-full object-cover md:w-96" 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Our team working" 
              />
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2021, K&N TaxMark Advisors started with a vision to simplify tax, legal, and business compliance for everyone. Our founders, CA Karan Sharma and Adv. Nidhi Verma, combined their expertise to create a one-stop solution for all financial and legal needs.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we have built a reputation for trust, accuracy, and personalized service. Our team stays updated with the latest regulations to ensure our clients are always compliant and ahead in their business journey.
              </p>
              <p className="text-gray-600">
                Whether you are an entrepreneur, a growing business, or an individual, we are here to guide you at every step—be it tax planning, GST, ITR filing, business registration, or legal advisory.
              </p>
            </div>
          </div>
        </div>

        {/* Founders Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Meet Our Founders</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/2">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CA Karan Sharma" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-200" />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">CA Karan Sharma</h3>
              <p className="text-blue-600 font-medium mb-2">Co-Founder & Chartered Accountant</p>
              <p className="text-gray-600 text-center">Expert in tax planning, GST, and business compliance. Passionate about helping clients grow with the right financial strategies.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Adv. Nidhi Verma" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-200" />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Adv. Nidhi Verma</h3>
              <p className="text-green-600 font-medium mb-2">Co-Founder & Legal Advisor</p>
              <p className="text-gray-600 text-center">Specialist in business law, registrations, and legal compliance. Dedicated to providing clear, actionable legal advice for every client.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;