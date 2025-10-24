import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OthersContactModal from "../../components/OthersContactModal";

const CookiePolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className={`flex flex-col items-center mb-12 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* <div className="w-28 h-28 bg-blue-100 rounded-3xl flex items-center justify-center shadow-lg mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                clipRule="evenodd"
              />
            </svg>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 text-center">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            We use cookies to enhance your experience on our website. By using
            our site, you consent to our use of cookies as described in this
            policy.
          </p>
        </div>

        {/* Main Content */}
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="p-8 md:p-10 space-y-8">
            {/* Introduction */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                About Our Cookie Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This Cookie Policy explains how our website uses cookies and
                similar technologies to recognize you when you visit our site.
                It explains what these technologies are and why we use them, as
                well as your rights to control our use of them.
              </p>
            </div>

            {/* What are cookies */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                What Are Cookies?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small data files that are placed on your computer or
                mobile device when you visit a website. Cookies are widely used
                by website owners to make their websites work, or to work more
                efficiently, as well as to provide reporting information.
              </p>
            </div>

            {/* How we use cookies */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.789l-4.764-2.382a1 1 0 00-.894 0L4.789 4.487a1 1 0 000 1.789l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                </span>
                How We Use Cookies
              </h2>
              <ul className="list-disc pl-8 text-gray-600 space-y-3">
                <li className="leading-relaxed">
                  Authentication: To recognize you when you visit our website
                  and to remember your preferences
                </li>
                <li className="leading-relaxed">
                  Security: To protect user accounts from unauthorized access
                </li>
                <li className="leading-relaxed">
                  Analytics: To analyze site traffic and usage patterns
                </li>
                <li className="leading-relaxed">
                  Personalization: To customize your experience based on your
                  interactions with our site
                </li>
              </ul>
            </div>

            {/* Cookie types */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Types of Cookies We Use
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      Essential Cookies
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Required for the website to function properly and cannot be
                    switched off.
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      Analytics Cookies
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Allow us to analyze site usage to improve performance and
                    user experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookie control */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Cookie Controls
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and/or delete cookies as you wish. You can
                delete all cookies that are already on your computer and you can
                set most browsers to prevent them from being placed.
              </p>
              <div className="bg-gray-50 p-5 rounded-xl mt-4">
                <h3 className="font-medium text-gray-800 mb-3">
                  Browser Settings:
                </h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>
                    Google Chrome: Settings → Advanced → Privacy and security →
                    Content settings → Cookies
                  </li>
                  <li>
                    Mozilla Firefox: Preferences → Privacy & Security → Cookies
                    and Site Data
                  </li>
                  <li>
                    Safari: Preferences → Privacy → Cookies and website data
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual element */}
            <div
              className="rounded-xl overflow-hidden mt-8 shadow-md opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="p-6 bg-blue-50 flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Have questions about our Cookie Policy?
                  </h3>
                  <p className="text-gray-600">
                    Contact our privacy team for more information.
                  </p>
                </div>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="mt-4 md:mt-0 cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:-translate-y-1"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div
          className="text-center mt-8 text-gray-500 text-sm opacity-0 animate-fade-in"
          style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
        >
          <p>Last updated: August 2023 | Version 2.1</p>
        </div>
      </div>

      {/* Contact Modal */}
      <OthersContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        source="cookie-policy"
        title="Questions About Our Cookie Policy?"
      />
    </div>
  );
};

export default CookiePolicyPage;
