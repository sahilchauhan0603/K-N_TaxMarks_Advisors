import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut, FiLogIn, FiStar, FiBookmark, FiShield, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  // Custom logout handler to show confirmation
  const handleLogout = () => {
    logout();
    setShowLogoutMsg(true);
    setTimeout(() => setShowLogoutMsg(false), 2000);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // Close user dropdown on outside click
    const handleClickOutside = (e) => {
      if (
        showUserDropdown &&
        !e.target.closest(".user-dropdown-btn") &&
        !e.target.closest(".user-dropdown-menu")
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleProtectedRoute = (route) => {
    if (!isAuthenticated) {
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

  return (
    <>
      {/* Logout confirmation message (always visible at top) */}
      {showLogoutMsg && (
        <div className="fixed top-5 right-5 z-500 pointer-events-none">
          <div className="toast-slide-in bg-white text-green-500 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <FiLogOut className="text-black text-xl" />
            <span>Logged out successfully</span>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes toastSlideInRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-slide-in {
          animation: toastSlideInRight 0.35s ease-out;
        }
      `}</style>
      
      <nav
        className={`bg-gradient-to-r from-white via-blue-50 to-white shadow-xl sticky top-0 z-50 transition-transform duration-300 border-b-2 border-blue-100 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                {/* Logo with hover effect */}
                <img
                  src={logo}
                  alt="Logo"
                  className="h-25 w-25 mr-3 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                {/* Tagline for larger screens */}
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <FiShield className="w-3 h-3" /> Trusted Tax Experts
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3" /> Your Financial Growth Partner
                  </span>
                </div>
              </Link>

              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4 relative">
                <NavLink to="/" text="Home" />
                <div className="relative group">
                  <button className="px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 focus:outline-none">
                    Services
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200 border border-blue-100">
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/tax-planning")
                      }
                      className="block px-4 cursor-pointer py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 w-full text-left font-medium rounded-t-xl transition-all duration-200"
                    >
                      Tax Planning
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/itr-filing")
                      }
                      className="block px-4 py-3 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 w-full text-left font-medium transition-all duration-200"
                    >
                      ITR Filing
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/gst-filing")
                      }
                      className="block px-4 py-3 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 w-full text-left font-medium transition-all duration-200"
                    >
                      GST Filing
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/trademark")
                      }
                      className="block px-4 py-3 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 w-full text-left font-medium transition-all duration-200"
                    >
                      Trademark & Legal
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/business-advisory")
                      }
                      className="block px-4 py-3 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 w-full text-left font-medium rounded-b-xl transition-all duration-200"
                    >
                      Business Advisory
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/reviews")}
                  className="px-3 py-2 rounded-md cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 relative group"
                >
                  {/* <FiStar className="w-4 h-4" /> */}
                  Reviews
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </button>
                <button
                  onClick={() => navigate("/contact-us")}
                  className="px-3 py-2 rounded-md cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 relative group"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="relative ml-2 flex items-center group">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="hidden md:flex  items-center text-sm cursor-pointer rounded-full focus:outline-none user-dropdown-btn"
                  >
                    {user?.profileImage || user?.picture ? (
                      <img
                        src={user.profileImage || user.picture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow duration-200">
                        <FiUser size={16} />
                      </div>
                    )}
                    {/* Show name on md+ screens, show only icon on mobile */}
                    <span className="ml-2 hidden md:inline text-gray-700 font-medium cursor-pointer">
                      {user?.name ||
                        user?.given_name ||
                        user?.first_name ||
                        "User"}
                    </span>
                  </button>
                  {/* Tooltip for mobile: show name on hover/focus */}
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-900 text-white text-xs font-medium whitespace-nowrap z-30 md:hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {user?.name ||
                      user?.given_name ||
                      user?.first_name ||
                      "User"}
                  </span>
                  {showUserDropdown && (
                    <div className="origin-top-right top-4 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 user-dropdown-menu">
                      <div className="py-1">
                        <button
                          onClick={() => { setShowUserDropdown(false); navigate('/profile'); }}
                          className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FiUser className="mr-2" /> User Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FiLogOut className="mr-2" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="ml-4 px-6 py-2.5 cursor-pointer bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl font-bold items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 hidden md:inline-flex relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <FiLogIn className="text-lg relative z-10" /> 
                  <span className="relative z-10">Login</span>
                  <span className="absolute right-0 top-0 h-full w-0 bg-white opacity-20 group-hover:w-full transition-all duration-500"></span>
                </button>
              )}

              <div className="md:hidden ml-4 flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-500 hover:text-gray-600 cursor-pointer focus:outline-none"
                  aria-label="Open menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => { setIsOpen(false); navigate('/'); }}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100"
            >
              {/* <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg> */}
              Home
            </button>
            <div className="relative">
              <button
                onClick={() =>
                  setIsOpen(isOpen === "services" ? false : "services")
                }
                className="px-3 py-2 cursor-pointer rounded-md text-base font-medium text-black hover:bg-gray-100 flex items-center gap-2"
              >
                Services
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen === "services" && (
                <div className="pl-4 py-2 space-y-1 bg-white rounded-md shadow-lg mt-1">
                  <button
                    onClick={() =>
                      handleProtectedRoute("/services/tax-planning")
                    }
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer"
                  >
                    Tax Planning
                  </button>
                  <button
                    onClick={() => handleProtectedRoute("/services/itr-filing")}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer"
                  >
                    ITR Filing
                  </button>
                  <button
                    onClick={() => handleProtectedRoute("/services/gst-filing")}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer"
                  >
                    GST Filing
                  </button>
                  <button
                    onClick={() => handleProtectedRoute("/services/trademark")}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer"
                  >
                    Trademark & Legal
                  </button>
                  <button
                    onClick={() =>
                      handleProtectedRoute("/services/business-advisory")
                    }
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer"
                  >
                    Business Advisory
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/reviews")}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100"
            >
              {/* <FiStar className="w-4 h-4" /> */}
              Reviews
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="flex items-center px-3 py-2 rounded-md cursor-pointer text-base font-medium text-black hover:bg-gray-100"
            >
              Contact Us
            </button>
            
            {isAuthenticated ? (
              <>
                {/* Mobile Profile Section */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    {user?.profileImage || user?.picture ? (
                      <img
                        src={user.profileImage || user.picture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        <FiUser size={20} />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.name || user?.given_name || user?.first_name || "User"}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <button
                      onClick={() => { setIsOpen(false); navigate('/profile'); }}
                      className="cursor-pointer px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" /> User Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer px-4 py-2.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 mt-2 w-full justify-center group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <FiLogIn className="text-lg relative z-10" /> 
                <span className="relative z-10">Login Now</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const NavLink = ({ to, text }) => (
  <Link
    to={to}
    className="px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 relative group"
  >
    {text}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

const MobileNavLink = ({ to, text }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100"
  >
    {text}
  </Link>
);

export default Navbar;
