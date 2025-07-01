import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiBarChart2, FiUsers, FiMail, FiTarget } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';

const heroImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";
const dashboardImage = "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1000&q=80";
const analyticsImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";

const HomePage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Dedicated inView and controls for features section
  const featuresControls = useAnimation();
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (featuresInView) {
      featuresControls.start('visible');
    }
  }, [featuresControls, featuresInView]);

  // Helper to reset animation when section goes out of view
  useEffect(() => {
    if (!featuresInView) {
      featuresControls.start('hidden');
    }
  }, [featuresInView, featuresControls]);

  // Dedicated inView and controls for dashboard section
  const dashboardControls = useAnimation();
  const [dashboardRef, dashboardInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  useEffect(() => {
    if (dashboardInView) {
      dashboardControls.start('visible');
    }
  }, [dashboardControls, dashboardInView]);

  // Helper to reset animation when section goes out of view
  useEffect(() => {
    if (!dashboardInView) {
      dashboardControls.start('hidden');
    }
  }, [dashboardInView, dashboardControls]);

  // Dedicated inView and controls for analytics section
  const analyticsControls = useAnimation();
  const [analyticsRef, analyticsInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  useEffect(() => {
    if (analyticsInView) {
      analyticsControls.start('visible');
    }
  }, [analyticsControls, analyticsInView]);

  // Helper to reset animation when section goes out of view
  useEffect(() => {
    if (!analyticsInView) {
      analyticsControls.start('hidden');
    }
  }, [analyticsInView, analyticsControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideInLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const slideInRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full">
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="relative py-20 px-4 overflow-hidden"
        >
          <div className="max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <motion.div 
                className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
                variants={slideInLeft}
              >
                <motion.h1 
                  className="text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Secure Your Finances. <span className="text-blue-600">Protect Your Brand.</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  K&N TaxMark Advisors is dedicated to providing individuals, startups, and businesses with expert financial guidance, reliable tax strategies, and comprehensive brand protection.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    to="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToFeatures();
                    }}
                    className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                  <Link 
                    to="/about-us" 
                    className="flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition duration-300 shadow hover:shadow-md transform hover:-translate-y-1"
                  >
                    Learn More
                  </Link>
                </motion.div>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, staggerChildren: 0.1 }}
                >
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FiCheckCircle className="text-green-500 mr-2" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div 
                className="lg:w-1/2 relative"
                variants={slideInRight}
              >
                <motion.img 
                  src={heroImage} 
                  alt="CRM Dashboard" 
                  className="w-full rounded-xl shadow-2xl border-8 border-white"
                  initial={{ rotate: 2 }}
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <motion.div 
                  className="absolute -bottom-8 -left-8 bg-white p-4 rounded-lg shadow-lg hidden lg:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCheckCircle className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700">Empowering Your Growth</p>
                      <p className="text-sm text-gray-500">Expert Tax, Legal & Business Solutions</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Features Grid */}
      <motion.section 
        id="features-grid" 
        className="py-16 px-4 bg-gray-50"
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Key Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage customer relationships effectively
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Sign in to access all features
              </p>
            )}
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${feature.color} ${
                  !isAuthenticated ? 'cursor-pointer' : ''
                }`}
                onClick={!isAuthenticated ? (e) => {
                  e.preventDefault();
                  login();
                } : undefined}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <Link 
                  to={isAuthenticated ? feature.link : '#'}
                  onClick={(e) => handleFeatureClick(e, feature.link)}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <motion.div 
                    className="text-blue-600 font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    {isAuthenticated ? (
                      <>
                        Learn more <FiArrowRight className="ml-1" />
                      </>
                    ) : (
                      <>
                        Sign in to access <FiArrowRight className="ml-1" />
                      </>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section 
        className="py-20 px-4 bg-white"
        ref={dashboardRef}
        initial="hidden"
        animate={dashboardControls}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
              variants={slideInLeft}
            >
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
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              variants={slideInRight}
            >
              <motion.img 
                src={dashboardImage} 
                alt="Dashboard Preview" 
                className="w-full rounded-xl shadow-xl border-8 border-white"
                whileHover={{ 
                  rotate: -1,
                  transition: { type: 'spring', stiffness: 100 }
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Analytics Preview */}
      <motion.section 
        className="py-20 px-4 bg-gray-50"
        ref={analyticsRef}
        initial="hidden"
        animate={analyticsControls}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 order-2 lg:order-1 mt-12 lg:mt-0"
              variants={slideInLeft}
            >
              <motion.img 
                src={analyticsImage} 
                alt="Analytics Preview" 
                className="w-full rounded-xl shadow-xl border-8 border-white"
                whileHover={{ 
                  rotate: 1,
                  transition: { type: 'spring', stiffness: 100 }
                }}
              />
            </motion.div>
            <motion.div 
              className="lg:w-1/2 lg:pl-12 order-1 lg:order-2"
              variants={slideInRight}
            >
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
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-r from-blue-50 to-gray-50 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-black"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to simplify your taxes and grow your business?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-black"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Partner with K&N TaxMark Advisors for expert tax, legal, and business solutions.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/contact-us" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get in Touch
            </Link>
            <motion.a
              href="https://wa.me/919318469138"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 13.487a4.5 4.5 0 01-6.349-6.349m6.349 6.349l2.121 2.121a1.5 1.5 0 01-2.121 2.121l-2.121-2.121m2.121-2.121a4.5 4.5 0 01-6.349-6.349" />
              </svg>
              Chat on WhatsApp
            </motion.a>
            <motion.a
              href="https://www.instagram.com/kn_taxmark/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-yellow-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.25 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 7.25A4.75 4.75 0 1 0 12 16.75a4.75 4.75 0 0 0 0-9.5zm0 1.5a3.25 3.25 0 1 1 0 6.5a3.25 3.25 0 0 1 0-6.5z" />
              </svg>
              Chat on Instagram
            </motion.a>
          </motion.div>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            We're here to help you every step of the way!
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;