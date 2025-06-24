import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiBarChart2, FiUsers, FiMail, FiTarget } from 'react-icons/fi';
// import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useAuth } from '../context/AuthContext';

const heroImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"; // Tax/finance desk
const dashboardImage = "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1000&q=80"; // Tax forms, calculator
const analyticsImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // Analytics/finance charts

const HomePage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiBarChart2 className="text-4xl mb-4 text-blue-600" />,
      title: 'Tax Planning',
      description: 'Strategic year-round tax saving plans customized to meet personal and business objectives.',
      link: '/services/tax-planning',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: <FiCheckCircle className="text-4xl mb-4 text-green-600" />,
      title: 'ITR Filing',
      description: 'Hassle-free and accurate Income Tax Return filing for individuals, firms, and companies.',
      link: '/services/itr-filing',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      icon: <FiBarChart2 className="text-4xl mb-4 text-yellow-600" />,
      title: 'GST Filing',
      description: 'Timely GST registration, filing, return reconciliation, and expert resolution services.',
      link: '/services/gst-filing',
      color: 'bg-yellow-50 hover:bg-yellow-100'
    },
    {
      icon: <FiTarget className="text-4xl mb-4 text-purple-600" />,
      title: 'Trademark & Legal',
      description: 'Secure your business identity through end-to-end support in trademark registration and compliance.',
      link: '/services/trademark',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      icon: <FiUsers className="text-4xl mb-4 text-pink-600" />,
      title: 'Business Advisory',
      description: 'Startup registration, company incorporation, and legal advisory for smooth operations and compliance.',
      link: '/services/business-advisory',
      color: 'bg-pink-50 hover:bg-pink-100'
    },
  ];

  const benefits = [
    "Expert financial guidance",
    "Reliable tax strategies",
    "Comprehensive brand protection",
    "Personalized business advisory",
    "Compliance and growth optimization"
  ];

  const handleFeatureClick = (e, link) => {
    if (!isAuthenticated) {
      e.preventDefault();
      if (typeof window.setShowAuthPopup === 'function') {
        window.setShowAuthPopup(true);
        setTimeout(() => {
          navigate(`/login?redirectTo=${encodeURIComponent(link)}`);
          window.setShowAuthPopup(false);
        }, 1200);
      } else {
        navigate(`/login?redirectTo=${encodeURIComponent(link)}`);
      }
    } else {
      navigate(link);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-grid');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Hero Section */}
      <div className="w-full">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Secure Your Finances. <span className="text-blue-600">Protect Your Brand.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  K&N TaxMark Advisors is dedicated to providing individuals, startups, and businesses with expert financial guidance, reliable tax strategies, and comprehensive brand protection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    to="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToFeatures();
                    }}
                    className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                  <Link 
                    to="/about-us" 
                    className="flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition duration-300 shadow hover:shadow-md"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                      <FiCheckCircle className="text-green-500 mr-2" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <img 
                  src={heroImage} 
                  alt="CRM Dashboard" 
                  className="w-full rounded-xl shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-lg shadow-lg hidden lg:block">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCheckCircle className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700">Empowering Your Growth</p>
                      <p className="text-sm text-gray-500">Expert Tax, Legal & Business Solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      {/* Features Grid */}
      <section id="features-grid" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage customer relationships effectively
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Sign in to access all features
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${feature.color} ${
                  !isAuthenticated ? 'cursor-pointer' : ''
                }`}
                onClick={!isAuthenticated ? (e) => {
                  e.preventDefault();
                  login();
                } : undefined}
              >
                <Link 
                  to={isAuthenticated ? feature.link : '#'}
                  onClick={(e) => handleFeatureClick(e, feature.link)}
                  className="flex flex-col items-center text-center"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="text-blue-600 font-medium flex items-center">
                    {isAuthenticated ? (
                      <>
                        Learn more <FiArrowRight className="ml-1" />
                      </>
                    ) : (
                      <>
                        Sign in to access <FiArrowRight className="ml-1" />
                      </>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Intuitive Dashboard
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get a complete overview of your finances and compliance with our beautifully designed dashboard.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time tax and compliance updates",
                  "Customizable financial widgets",
                  "Performance metrics",
                  "Quick access to advisory services"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2">
              <img 
                src={dashboardImage} 
                alt="Dashboard Preview" 
                className="w-full rounded-xl shadow-xl border-8 border-white transform -rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 order-2 lg:order-1 mt-12 lg:mt-0">
              <img 
                src={analyticsImage} 
                alt="Analytics Preview" 
                className="w-full rounded-xl shadow-xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
            <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Advanced Analytics
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Make data-driven decisions with our powerful analytics tools and visualizations for your tax and business needs.
              </p>
              <ul className="space-y-4">
                {[
                  "Tax savings tracking",
                  "Compliance status analysis",
                  "Custom report generation",
                  "Export to PDF/Excel"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-gray-50 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Ready to simplify your taxes and grow your business?</h2>
          <p className="text-xl mb-8 text-black">Partner with K&N TaxMark Advisors for expert tax, legal, and business solutions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact-us" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;