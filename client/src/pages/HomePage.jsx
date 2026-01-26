import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiBarChart2, FiUsers, FiMail, FiTarget, FiTrendingUp, FiShield, FiZap, FiAward } from 'react-icons/fi';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import HeadlineBanner from '../components/HeadlineBanner';
import '../HomePage.css';

const heroImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80";
const dashboardImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80";
const analyticsImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80";

const HomePage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      icon: <FiBarChart2 className="text-4xl mb-4" />,
      title: 'Tax Planning',
      description: 'Strategic year-round tax saving plans customized to meet personal and business objectives.',
      link: '/services/tax-planning',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: <FiCheckCircle className="text-4xl mb-4" />,
      title: 'ITR Filing',
      description: 'Hassle-free and accurate Income Tax Return filing for individuals, firms, and companies.',
      link: '/services/itr-filing',
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      icon: <FiTrendingUp className="text-4xl mb-4" />,
      title: 'GST Filing',
      description: 'Timely GST registration, filing, return reconciliation, and expert resolution services.',
      link: '/services/gst-filing',
      gradient: 'from-yellow-400 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100'
    },
    {
      icon: <FiTarget className="text-4xl mb-4" />,
      title: 'Trademark & Legal',
      description: 'Secure your business identity through end-to-end support in trademark registration and compliance.',
      link: '/services/trademark',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      icon: <FiUsers className="text-4xl mb-4" />,
      title: 'Business Advisory',
      description: 'Startup registration, company incorporation, and legal advisory for smooth operations and compliance.',
      link: '/services/business-advisory',
      gradient: 'from-pink-400 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Headline Banner */}
      <div className="relative z-10">
        <HeadlineBanner />
      </div>

      {/* Hero Section */}
      <div className="w-full relative z-10">
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="relative py-6 px-4 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <motion.div 
                className="lg:w-1/2 space-y-8"
                variants={slideInLeft}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    🎯 Your Trusted Financial Partner
                  </motion.div>
                  <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Secure Your Finances.{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Protect Your Brand.
                    </span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  className="text-xl text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  K&N TaxMark Advisors is dedicated to providing individuals, startups, and businesses with expert financial guidance, reliable tax strategies, and comprehensive brand protection.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="#features-grid" 
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToFeatures();
                      }}
                      className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      Get Started 
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FiArrowRight className="ml-2" />
                      </motion.div>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/about-us" 
                      className="flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-xl border-2 border-gray-100"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-2 gap-4 pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {[
                    { icon: <FiShield />, text: "100% Secure", color: "red" },
                    { icon: <FiZap />, text: "Fast Processing", color: "yellow" },
                    { icon: <FiAward />, text: "Expert Team", color: "purple" },
                    { icon: <FiCheckCircle />, text: "Trusted by 1000+", color: "green" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-${item.color}-100`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className={`text-${item.color}-600 text-xl`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div 
                className="lg:w-1/2 relative"
                variants={slideInRight}
                style={{ y: y1 }}
              >
                <motion.div
                  className="relative"
                  animate={{ 
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.img 
                    src={heroImage} 
                    alt="CRM Dashboard" 
                    className="w-full rounded-2xl shadow-2xl border-8 border-white relative z-10"
                    whileHover={{ 
                      scale: 1.02,
                      rotate: [0, 1, -1, 0],
                      transition: { duration: 0.3 }
                    }}
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-2xl shadow-2xl z-20"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiTrendingUp className="text-3xl mb-1" />
                    <p className="font-bold text-sm">Growth</p>
                    <p className="text-xs">+125%</p>
                  </motion.div>

                  <motion.div 
                    className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl z-20 hidden lg:block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: [0, -5, 0]
                    }}
                    transition={{
                      opacity: { delay: 1.2 },
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl">
                        <FiCheckCircle className="text-white text-2xl" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Empowering Your Growth</p>
                        <p className="text-sm text-gray-600">Expert Tax, Legal & Business Solutions</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-1/4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-2xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Features Grid */}
      <motion.section 
        id="features-grid" 
        className="py-24 px-4 bg-white relative z-10"
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
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨ Our Services
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Solutions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your finances, taxes, and business compliance effectively
            </p>
            {!isAuthenticated && (
              <motion.p 
                className="text-sm text-blue-600 mt-4 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔐 Sign in to unlock all features
              </motion.p>
            )}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={!isAuthenticated ? (e) => {
                  e.preventDefault();
                  login();
                } : undefined}
              >
                <Link 
                  to={isAuthenticated ? feature.link : '#'}
                  onClick={(e) => handleFeatureClick(e, feature.link)}
                  className="block h-full"
                >
                  <div className={`relative h-full p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm transition-all duration-500 hover:shadow-2xl overflow-hidden`}>
                    {/* Animated gradient overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div 
                        className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <motion.div 
                        className="flex items-center text-blue-600 font-semibold"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {isAuthenticated ? (
                          <>
                            Explore Service <FiArrowRight className="ml-2" />
                          </>
                        ) : (
                          <>
                            Sign in to access <FiArrowRight className="ml-2" />
                          </>
                        )}
                      </motion.div>
                    </div>

                    {/* Decorative corner */}
                    <motion.div
                      className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent rounded-bl-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section 
        className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative z-10 overflow-hidden"
        ref={dashboardRef}
        initial="hidden"
        animate={dashboardControls}
        variants={containerVariants}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2 space-y-6"
              variants={slideInLeft}
            >
              <motion.div
                className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                💼 Dashboard Features
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Intuitive{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Get a complete overview of your finances and compliance with our beautifully designed dashboard.
              </p>
              
              <ul className="space-y-4">
                {[
                  { text: "Real-time tax and compliance updates", icon: <FiTrendingUp /> },
                  { text: "Customizable financial widgets", icon: <FiBarChart2 /> },
                  { text: "Performance metrics at a glance", icon: <FiTarget /> },
                  { text: "Quick access to advisory services", icon: <FiZap /> }
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start group"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-green-400 to-green-600 text-white p-2 rounded-lg mr-4 flex-shrink-0"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.2
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-gray-700 text-lg pt-1 group-hover:text-gray-900 transition-colors">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to={isAuthenticated ? "/profile" : "#"}
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      if (typeof window.setShowAuthPopup === 'function') {
                        window.setShowAuthPopup(true);
                        setTimeout(() => {
                          navigate('/login?redirectTo=' + encodeURIComponent('/profile'));
                          window.setShowAuthPopup(false);
                        }, 1200);
                      } else {
                        navigate('/login?redirectTo=' + encodeURIComponent('/profile'));
                      }
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  View Your Dashboard
                  <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              variants={slideInRight}
            >
              <motion.div
                className="relative"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.img 
                  src={dashboardImage} 
                  alt="Dashboard Preview" 
                  className="w-full rounded-2xl shadow-2xl border-8 border-white relative z-10"
                  whileHover={{ 
                    scale: 1.02,
                    rotate: -1,
                    transition: { type: 'spring', stiffness: 100 }
                  }}
                />

                {/* Floating stats cards */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg">
                      <FiBarChart2 className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tax Savings</p>
                      <p className="text-lg font-bold text-gray-900">₹2.5L+</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-20"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-lg">
                      <FiCheckCircle className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clients Served</p>
                      <p className="text-lg font-bold text-gray-900">1000+</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute top-1/3 -left-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Analytics Preview */}
      <motion.section 
        className="py-24 px-4 bg-white relative z-10 overflow-hidden"
        ref={analyticsRef}
        initial="hidden"
        animate={analyticsControls}
        variants={containerVariants}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2 order-2 lg:order-1 relative"
              variants={slideInLeft}
            >
              <motion.div
                className="relative"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.img 
                  src={analyticsImage} 
                  alt="Analytics Preview" 
                  className="w-full rounded-2xl shadow-2xl border-8 border-white relative z-10"
                  whileHover={{ 
                    scale: 1.02,
                    rotate: 1,
                    transition: { type: 'spring', stiffness: 100 }
                  }}
                />

                {/* Floating metric badges */}
                <motion.div
                  className="absolute top-8 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-2xl"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-center">
                    <FiTrendingUp className="text-3xl mb-1 mx-auto" />
                    <p className="font-bold">98%</p>
                    <p className="text-xs">Accuracy</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-8 -left-4 bg-gradient-to-br from-purple-400 to-pink-500 text-white p-4 rounded-2xl shadow-2xl"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-center">
                    <FiAward className="text-3xl mb-1 mx-auto" />
                    <p className="font-bold">24/7</p>
                    <p className="text-xs">Support</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-1/4 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full filter blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            <motion.div 
              className="lg:w-1/2 order-1 lg:order-2 space-y-6"
              variants={slideInRight}
            >
              <motion.div
                className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                📊 Analytics & Insights
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Advanced{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Analytics
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Make data-driven decisions with our powerful analytics tools and visualizations for your tax and business needs.
              </p>
              
              <ul className="space-y-4">
                {[
                  { text: "Tax savings tracking & projections", icon: <FiTrendingUp />, color: "from-blue-400 to-blue-600" },
                  { text: "Compliance status analysis", icon: <FiShield />, color: "from-green-400 to-green-600" },
                  { text: "Custom report generation", icon: <FiBarChart2 />, color: "from-purple-400 to-purple-600" },
                  { text: "Export to PDF/Excel formats", icon: <FiTarget />, color: "from-pink-400 to-pink-600" }
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start group"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className={`bg-gradient-to-br ${item.color} text-white p-2 rounded-lg mr-4 flex-shrink-0`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.2
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-gray-700 text-lg pt-1 group-hover:text-gray-900 transition-colors">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { value: "10K+", label: "Reports Generated" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "4.9/5", label: "Client Rating" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4 rounded-xl border border-gray-200"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
                    }}
                  >
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)`
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200"
              animate={{
                boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 15px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🚀 Start Your Journey Today
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              Ready to simplify your taxes and{' '}
              <span className="inline-block text-blue-700 px-4 py-1 rounded-lg">
                grow your business?
              </span>
            </h2>
          </motion.div>

          <motion.p 
            className="text-xl mb-10 text-gray-700 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Partner with K&N TaxMark Advisors for expert tax, legal, and business solutions. Let's achieve excellence together.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/contact-us" 
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <FiMail className="text-xl" />
                Get in Touch
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiArrowRight className="text-xl" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.a
                href="https://wa.me/919318469138"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Chat on WhatsApp
              </motion.a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.a
                href="https://www.instagram.com/kn_taxmark/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-xl font-bold hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.25 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 7.25A4.75 4.75 0 1 0 12 16.75a4.75 4.75 0 0 0 0-9.5zm0 1.5a3.25 3.25 0 1 1 0 6.5a3.25 3.25 0 0 1 0-6.5z" />
                </svg>
                Chat on Instagram
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: <FiUsers />, text: "100+ Happy Clients" },
              { icon: <FiShield />, text: "100% Secure" },
              { icon: <FiZap />, text: "24/7 Support" },
              // { icon: <FiAward />, text: "Award Winning" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-gray-700"
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-2xl">{item.icon}</div>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p 
            className="text-gray-600 text-sm mt-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            ✨ We're here to help you every step of the way! ✨
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;