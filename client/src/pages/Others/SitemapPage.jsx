import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, FiInfo, FiMail, FiBookOpen, FiShield, FiUser, 
  FiFileText, FiList, FiLock, FiUsers, FiBarChart2, 
  FiCheckCircle, FiTarget, FiBriefcase, FiChevronDown, 
  FiChevronUp, FiSettings, FiPieChart, FiFolder, FiDollarSign 
} from 'react-icons/fi';

const SitemapPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openSections, setOpenSections] = useState({
    main: true,
    services: true,
    auth: false,
    admin: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .section-transition { transition: all 0.3s ease; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className={`flex flex-col items-center mb-10 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 border-2 border-blue-200">
            <FiList className="w-12 h-12 text-blue-600" />
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2 text-center">Website Sitemap</h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl">Quick links to all important pages, services, and admin dashboard at K&N TaxMark Advisors.</p>
        </div>

        {/* Main Content */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="p-8 md:p-10">
            {/* Main Pages Section */}
            <div className="mb-8">
              <button 
                onClick={() => toggleSection('main')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                  <FiList className="mr-3" /> Main Pages
                </h2>
                {openSections.main ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-blue-600" />}
              </button>
              
              <div className={`section-transition overflow-hidden ${openSections.main ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                  <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiHome className="text-blue-600" />
                    </div>
                    <span>Home</span>
                  </Link>
                  
                  <Link to="/about-us" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiInfo className="text-blue-600" />
                    </div>
                    <span>About Us</span>
                  </Link>
                  
                  <Link to="/contact-us" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiMail className="text-blue-600" />
                    </div>
                    <span>Contact Us</span>
                  </Link>
                  
                  <Link to="/faq" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBookOpen className="text-blue-600" />
                    </div>
                    <span>FAQ</span>
                  </Link>
                  
                  <Link to="/privacy" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiShield className="text-blue-600" />
                    </div>
                    <span>Privacy Policy</span>
                  </Link>
                  
                  <Link to="/terms" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-blue-600" />
                    </div>
                    <span>Terms of Service</span>
                  </Link>
                  
                  <Link to="/cookies" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-blue-600" />
                    </div>
                    <span>Cookie Policy</span>
                  </Link>
                  
                  <Link to="/sitemap" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiList className="text-blue-600" />
                    </div>
                    <span>Sitemap</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-8">
              <button 
                onClick={() => toggleSection('services')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                  <FiBriefcase className="mr-3" /> Services
                </h2>
                {openSections.services ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-blue-600" />}
              </button>
              
              <div className={`section-transition overflow-hidden ${openSections.services ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                  <Link to="/services/tax-planning" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBarChart2 className="text-blue-600" />
                    </div>
                    <span>Tax Planning</span>
                  </Link>
                  
                  <Link to="/services/itr-filing" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="text-blue-600" />
                    </div>
                    <span>ITR Filing</span>
                  </Link>
                  
                  <Link to="/services/gst-filing" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="text-blue-600" />
                    </div>
                    <span>GST Filing</span>
                  </Link>
                  
                  <Link to="/services/trademark" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiTarget className="text-blue-600" />
                    </div>
                    <span>Trademark & Legal</span>
                  </Link>
                  
                  <Link to="/services/business-advisory" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiUsers className="text-blue-600" />
                    </div>
                    <span>Business Advisory</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Auth Pages Section */}
            <div className="mb-8">
              <button 
                onClick={() => toggleSection('auth')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                  <FiLock className="mr-3" /> Authentication
                </h2>
                {openSections.auth ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-blue-600" />}
              </button>
              
              <div className={`section-transition overflow-hidden ${openSections.auth ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-2">
                  <Link to="/login" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <span>Login</span>
                  </Link>
                  
                  <Link to="/signup" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <span>Signup</span>
                  </Link>
                  
                  <Link to="/forgot-password" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiLock className="text-blue-600" />
                    </div>
                    <span>Forgot Password</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin Section */}
            <div>
              <button 
                onClick={() => toggleSection('admin')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                  <FiSettings className="mr-3" /> Admin Panel
                </h2>
                {openSections.admin ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-blue-600" />}
              </button>
              
              <div className={`section-transition overflow-hidden ${openSections.admin ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                  <Link to="/admin/login" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiLock className="text-blue-600" />
                    </div>
                    <span>Admin Login</span>
                  </Link>
                  
                  <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiPieChart className="text-blue-600" />
                    </div>
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiUsers className="text-blue-600" />
                    </div>
                    <span>User Management</span>
                  </Link>
                  
                  <Link to="/admin/reports" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-blue-600" />
                    </div>
                    <span>Reports</span>
                  </Link>
                  
                  <Link to="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiSettings className="text-blue-600" />
                    </div>
                    <span>Settings</span>
                  </Link>
                  
                  <Link to="/admin/trademark" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiTarget className="text-blue-600" />
                    </div>
                    <span>Trademark Requests</span>
                  </Link>
                  
                  <Link to="/admin/business-advisory" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBriefcase className="text-blue-600" />
                    </div>
                    <span>Business Advisory</span>
                  </Link>
                  
                  <Link to="/admin/tax-planning" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBarChart2 className="text-blue-600" />
                    </div>
                    <span>Tax Planning</span>
                  </Link>
                  
                  <Link to="/admin/gst" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="text-blue-600" />
                    </div>
                    <span>GST Requests</span>
                  </Link>
                  
                  <Link to="/admin/itr" className="flex items-center gap-3 p-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="text-blue-600" />
                    </div>
                    <span>ITR Requests</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Visual element */}
            <div className="rounded-xl overflow-hidden mt-10 shadow-md">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="p-6 bg-blue-50 flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Can't find what you're looking for?</h3>
                  <p className="text-gray-600">Contact our team for more information or personalized support.</p>
                </div>
                <Link 
                  to="/contact-us" 
                  className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:-translate-y-1"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2023 K&N TaxMark Advisors. All rights reserved. | Version 2.2</p>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;