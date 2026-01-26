import React from "react";
import { FaRocket, FaUsers, FaChartLine, FaUserTie } from "react-icons/fa";

const AboutUsPage = () => {
  const features = [
    {
      icon: <FaRocket className="text-3xl mb-4 text-slate-700" />,
      title: "Our Mission",
      description:
        "To empower individuals and businesses with expert tax, legal, and business advisory services, ensuring compliance and growth.",
    },
    {
      icon: <FaUsers className="text-3xl mb-4 text-slate-700" />,
      title: "Who We Are",
      description:
        "K&N TaxMark Advisors is a team of experienced Chartered Accountants and legal professionals dedicated to providing reliable, transparent, and client-focused solutions.",
    },
    {
      icon: <FaChartLine className="text-3xl mb-4 text-slate-700" />,
      title: "Our Impact",
      description:
        "Serving clients across India, we have helped startups, SMEs, and individuals achieve their financial and legal goals.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200 py-4 md:py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">
              About K&N TaxMark Advisors
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in tax, legal, and business advisory services
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-1 sm:px-1 lg:px-1 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 p-6 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-full w-full object-cover md:w-96"
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Our team working"
                />
              </div>
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Founded in 2025, K&N TaxMark Advisors started with a vision to
                simplify tax, legal, and business compliance for everyone. Our
                founders, CA Komal Chauhan and Adv. Niharika Chauhan, combined
                their expertise to create a one-stop solution for all financial
                and legal needs.
              </p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Over the time, we have built a reputation for trust, accuracy,
                and personalized service. Our team stays updated with the latest
                regulations to ensure our clients are always compliant and ahead
                in their business journey.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Whether you are an entrepreneur, a growing business, or an
                individual, we are here to guide you at every step—be it tax
                planning, GST, ITR filing, business registration, or legal
                advisory.
              </p>
            </div>
          </div>
        </div>

          {/* Founders Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Meet Our Founders
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
              <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col items-center w-full md:w-1/2 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-2 border-slate-200">
                  <FaUserTie className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  CA Komal Chauhan
                </h3>
                <p className="text-slate-600 font-medium mb-3 text-sm">
                  Co-Founder & Chartered Accountant
                </p>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                Expert in tax planning, GST, and business compliance. Passionate
                about helping clients grow with the right financial strategies.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col items-center w-full md:w-1/2 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-2 border-slate-200">
                  <FaUserTie className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Adv. Niharika Chauhan
                </h3>
                <p className="text-slate-600 font-medium mb-3 text-sm">
                  Co-Founder & Legal Advisor
                </p>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  Specialist in business law, registrations, and legal compliance.
                  Dedicated to providing clear, actionable legal advice for every
                  client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
