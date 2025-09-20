import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
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
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up">
            <FiLogOut className="text-white text-xl" />
            <span>Logged out successfully</span>
          </div>
        </div>
      )}
      <nav
        className={`bg-gray-50 shadow-lg sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <img
                  src={logo}
                  alt="Logo"
                  className="h-25 w-25 mr-2 object-contain"
                />
                {/* <span className="text-2xl font-bold text-blue-600">K&N TaxMark Advisors</span> */}
              </Link>

              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4 relative">
                <NavLink to="/" text="Home" />
                <div className="relative group">
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-black hover:text-blue-600 transition duration-300 flex items-center focus:outline-none">
                    Services
                    <svg
                      className="ml-1 w-4 h-4"
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
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200">
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/tax-planning")
                      }
                      className="block px-4 cursor-pointer py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
                    >
                      Tax Planning
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/itr-filing")
                      }
                      className="block px-4 py-2 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
                    >
                      ITR Filing
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/gst-filing")
                      }
                      className="block px-4 py-2 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
                    >
                      GST Filing
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/trademark")
                      }
                      className="block px-4 py-2 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
                    >
                      Trademark & Legal
                    </button>
                    <button
                      onClick={() =>
                        handleProtectedRoute("/services/business-advisory")
                      }
                      className="block px-4 py-2 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
                    >
                      Business Advisory
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/contact-us")}
                  className="px-3 py-2 rounded-md cursor-pointer text-sm font-medium text-black hover:text-blue-600 transition duration-300"
                >
                  Contact Us
                </button>
              </div>
            </div>

            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="relative ml-2 flex items-center group">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center text-sm cursor-pointer rounded-full focus:outline-none user-dropdown-btn"
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
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
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 user-dropdown-menu">
                      <div className="py-1">
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
                  className="ml-4 px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold items-center gap-2 shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 hidden md:inline-flex"
                >
                  <FiLogIn className="text-lg" /> Login
                </button>
              )}

              <div className="md:hidden ml-4 flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
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
            <MobileNavLink to="/" text="Home" />
            <div className="relative">
              <button
                onClick={() =>
                  setIsOpen(isOpen === "services" ? false : "services")
                }
                className="w-full px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100 flex items-center justify-between"
              >
                Services
                <svg
                  className="ml-2 w-4 h-4"
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
              onClick={() => navigate("/contact-us")}
              className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100"
            >
              Contact Us
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left cursor-pointer px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 flex items-center gap-2 shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 mt-2"
              >
                <FiLogIn className="text-lg" /> Login
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
    className="px-3 py-2 rounded-md text-sm font-medium text-black hover:text-blue-600 transition duration-300"
  >
    {text}
  </Link>
);

const MobileNavLink = ({ to, text }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100"
  >
    {text}
  </Link>
);

export default Navbar;
