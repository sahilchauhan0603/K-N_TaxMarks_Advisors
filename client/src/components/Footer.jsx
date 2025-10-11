import React from 'react';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaInstagram
} from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle protected navigation for services - same as navbar
  const handleProtectedRoute = (route) => {
    if (!user) {
      if (typeof window.setShowAuthPopup === "function") {
        window.setShowAuthPopup(true);
        setTimeout(() => {
          navigate(`/login?redirectTo=${encodeURIComponent(route)}`);
          window.setShowAuthPopup(false);
        }, 1200);
      } else {
        navigate(`/login?redirectTo=${encodeURIComponent(route)}`);
      }
    } else {
      navigate(route);
    }
  };

  const links = [
    {
      title: "Services",
      items: [
        { name: "Tax Planning", href: "/services/tax-planning" },
        { name: "ITR Filing", href: "/services/itr-filing" },
        { name: "GST Filing", href: "/services/gst-filing" },
        { name: "Business Advisory", href: "/services/business-advisory" },
        { name: "Trademark & Legal", href: "/services/trademark" }
      ]
    },
    {
      title: "Company",
      items: [
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact-us" },
        // { name: "Careers", href: "/careers" },
        // { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "FAQ", href: "/faq" },
        // { name: "Community", href: "/community" },
        // { name: "Downloads", href: "/downloads" },
        // { name: "Client Portal", href: "/portal" }
      ]
    },
    {
      title: "Contact",
      items: [
        { name: "kntaxmarkadvisors@gmail.com", href: "mailto:kntaxmarkadvisors@gmail.com", icon: <FiMail className="mr-2" /> },
        { name: "+91 9318469138", href: "tel:+919318469138", icon: <FiPhone className="mr-2" /> },
        { name: "Krishna Nagar, Delhi, India", href: "https://maps.google.com/?q=Krishna+Nagar+Delhi", icon: <FiMapPin className="mr-2" /> }
      ]
    }
  ];

  const socialLinks = [
    // { 
    //   icon: <FaLinkedin />, 
    //   url: "https://linkedin.com/company/kn_taxmark",
    //   name: "LinkedIn"
    // },
    // { 
    //   icon: <FaFacebook />, 
    //   url: "https://facebook.com/kn_taxmark",
    //   name: "Facebook"
    // },
    { 
      icon: <FaEnvelope />, 
      url: "mailto:kntaxmarkadvisors@gmail.com",
      name: "Email"
    },
    { 
      icon: <FaPhone />, 
      url: "tel:+919318469138",
      name: "Phone"
    },
    { 
      icon: <FaInstagram />, 
      url: "https://instagram.com/kn_taxmark",
      name: "Instagram"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          {links.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.href.startsWith('http') || item.href.startsWith('mailto') || item.href.startsWith('tel') ? (
                      <a
                        href={item.href}
                        className="flex items-center justify-center md:justify-start text-gray-300 hover:text-white transition-colors duration-200 group"
                        target={item.href.startsWith('http') ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.name}</span>
                        {item.href.startsWith('http') && (
                          <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-1" />
                        )}
                      </a>
                    ) : item.href.startsWith('/services/') ? (
                      <button
                        onClick={() => handleProtectedRoute(item.href)}
                        className="flex items-center cursor-pointer justify-center md:justify-start text-gray-300 hover:text-white transition-colors duration-200 group w-full text-left"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center justify-center md:justify-start text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 w-full md:w-auto flex flex-col md:flex-row md:items-center md:justify-start items-center text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start w-full">
                <img src={logo} alt="K&N TaxMark Logo" className="h-15 w-15 mr-4 rounded-lg bg-white shadow" />
                <div>
                  <h4 className="text-lg font-bold text-white">K&N TaxMark Advisors</h4>
                  <p className="text-sm text-gray-400">Tax, Legal & Business Advisory</p>
                </div>
                <Link
                  to="/admin/login"
                  className="ml-6 inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 border-2 border-blue-600 hover:border-blue-800"
                >
                  Admin Panel
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-4 w-full md:w-auto">
              <div className="flex space-x-6 items-center w-full md:w-auto justify-center md:justify-end">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="text-gray-400 hover:text-white text-xl transition-all duration-300 transform hover:scale-110"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              <div className="text-center md:text-right flex flex-col md:flex-row md:items-center md:justify-end gap-4 mt-4 md:mt-0 w-full md:w-auto">
                <div className="w-full md:w-auto">
                  <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} K&N TaxMark Advisors. All rights reserved.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center md:justify-end space-x-4 text-xs text-gray-500">
                    <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
                    <Link to="/cookies" className="hover:text-gray-300">Cookie Policy</Link>
                    <Link to="/sitemap" className="hover:text-gray-300">Sitemap</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;