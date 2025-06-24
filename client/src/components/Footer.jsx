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
import logo from '../assets/logo.png';

const Footer = () => {
  const links = [
    {
      title: "Services",
      items: [
        { name: "Tax Planning", href: "/services" },
        { name: "ITR Filing", href: "/services" },
        { name: "GST Filing", href: "/services" },
        { name: "Business Advisory", href: "/services" },
        { name: "Trademark & Legal", href: "/services" }
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
    { 
      icon: <FaLinkedin />, 
      url: "https://linkedin.com/company/kntaxmarkadvisors",
      name: "LinkedIn"
    },
    { 
      icon: <FaFacebook />, 
      url: "https://facebook.com/kntaxmarkadvisors",
      name: "Facebook"
    },
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
      url: "https://instagram.com/kntaxmarkadvisors",
      name: "Instagram"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {links.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a 
                      href={item.href}
                      className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                      target={item.href.startsWith('http') ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <span>{item.name}</span>
                      {item.href.startsWith('http') && (
                        <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-1" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img src={logo} alt="K&N TaxMark Logo" className="h-15 w-15 mr-4 rounded-lg bg-white shadow" />
                <div>
                  <h4 className="text-lg font-bold text-white">K&N TaxMark Advisors</h4>
                  <p className="text-sm text-gray-400">Tax, Legal & Business Advisory</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-4">
              <div className="flex space-x-6">
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
              
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} K&N TaxMark Advisors. All rights reserved.
                </p>
                <div className="mt-2 flex flex-wrap justify-center md:justify-end space-x-4 text-xs text-gray-500">
                  <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
                  <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
                  <a href="/cookies" className="hover:text-gray-300">Cookie Policy</a>
                  <a href="/sitemap" className="hover:text-gray-300">Sitemap</a>
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