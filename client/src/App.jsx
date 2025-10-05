import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CompleteProfilePage from "./pages/auth/CompleteProfilePage";
import GoogleAuthHandler from "./components/GoogleAuthHandler";

import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";

import FAQPage from "./pages/Others/FAQPage";
import PrivacyPolicyPage from "./pages/Others/PrivacyPolicyPage";
import TermsPage from "./pages/Others/TermsPage";
import CookiePolicyPage from "./pages/Others/CookiePolicyPage";
import SitemapPage from "./pages/Others/SitemapPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingBar from "./components/LoadingBar";
import ScrollToTop from "./components/ScrollToTop";
import LoadFromTop from "./components/LoadFromTop";
import UserProfile from "./pages/user/UserProfile";

import TaxPlanning from "./pages/services/TaxPlanning/TaxPlanning";
import ITRFiling from "./pages/services/ITRFiling/ITRFiling";
import GSTFiling from "./pages/services/GSTFiling/GSTFiling";
import Trademark from "./pages/services/TradeMark/Trademark";
import BusinessAdvisory from "./pages/services/BusinessAdvisory/BusinessAdvisory";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Others/Users";
import ReportsPage from "./pages/admin/Others/Reports";
import SettingsPage from "./pages/admin/Others/Settings";
import AdminTrademark from "./pages/admin/TablesForForms/AdminTrademark";
import AdminBusiness from "./pages/admin/TablesForForms/AdminBusiness";
import AdminTaxPlanning from "./pages/admin/TablesForForms/AdminTaxPlanning";
import AdminGST from "./pages/admin/TablesForForms/AdminGST";
import AdminITR from "./pages/admin/TablesForForms/AdminITR";
import AdminTestimonials from "./pages/admin/AdminTestimonials";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const servicePaths = React.useMemo(
    () => [
      "/services/tax-planning",
      "/services/itr-filing",
      "/services/gst-filing",
      "/services/trademark",
      "/services/business-advisory",
    ],
    []
  );

  // Set document title based on route
  useEffect(() => {
    let pageTitle = "";
    switch (location.pathname) {
      case "/":
        pageTitle = "Home";
        break;
      case "/login":
        pageTitle = "Login";
        break;
      case "/signup":
        pageTitle = "Signup";
        break;
      case "/forgot-password":
        pageTitle = "Forgot Password";
        break;
      case "/complete-profile":
        pageTitle = "Complete Profile";
        break;
      case "/about-us":
        pageTitle = "About Us";
        break;
      case "/contact-us":
        pageTitle = "Contact Us";
        break;
      case "/faq":
        pageTitle = "FAQ";
        break;
      case "/privacy":
        pageTitle = "Privacy Policy";
        break;
      case "/terms":
        pageTitle = "Terms & Conditions";
        break;
      case "/cookies":
        pageTitle = "Cookie Policy";
        break;
      case "/sitemap":
        pageTitle = "Sitemap";
        break;
      case "/services/tax-planning":
        pageTitle = "Tax Planning";
        break;
      case "/services/itr-filing":
        pageTitle = "ITR Filing";
        break;
      case "/services/gst-filing":
        pageTitle = "GST Filing";
        break;
      case "/services/trademark":
        pageTitle = "Trademark";
        break;
      case "/services/business-advisory":
        pageTitle = "Business Advisory";
        break;
      case "/profile":
        pageTitle = "User Profile";
        break;
      default:
        if (location.pathname.startsWith("/admin")) {
          pageTitle = "Admin";
        } else {
          pageTitle = "K&N";
        }
    }
    document.title = `${pageTitle} | K&N`;
  }, [location.pathname]);

  // Protect service routes
  useEffect(() => {
    if (
      !loading &&
      servicePaths.includes(location.pathname) &&
      !isAuthenticated
    ) {
      // setShowAuthPopup(true);
      // setTimeout(() => {
      //   navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
      //   setShowAuthPopup(false);
      // }, 1200);
    }
  }, [location, isAuthenticated, loading, navigate, servicePaths]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading time
    return () => clearTimeout(timer);
  }, [location]);

  // Redirect after login if redirectTo param exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get("redirectTo");
    if (redirectTo && location.pathname === "/login") {
      // navigate(redirectTo);
    }
  }, [location, navigate]);

  // Features section: show popup if not logged in and user clicks a feature
  const handleProtectedFeatureClick = (e, link) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthPopup(true);
      setTimeout(() => {
        navigate(`/login?redirectTo=${encodeURIComponent(link)}`);
        setShowAuthPopup(false);
      }, 1200);
    } else {
      navigate(link);
    }
  };

  // Expose setShowAuthPopup globally for HomePage
  useEffect(() => {
    window.setShowAuthPopup = setShowAuthPopup;
    return () => {
      window.setShowAuthPopup = undefined;
    };
  }, []);

  // Helper: check if current route is admin panel
  const isAdminRoute = location.pathname.startsWith("/admin");
  // Helper: check if current route is login or signup
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/complete-profile" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <LoadingBar isLoading={isLoading} />
      <ScrollToTop />
      {!isAdminRoute && !isAuthPage && <Navbar />}
      <main className="flex-grow">
        {loading ? (
          // ✅ Loading state rendered INSIDE JSX (doesn't break hook order)
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        ) : (
          <>
            {/* Toast Popup for Auth Redirect */}
            {showAuthPopup && (
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up">
                  <p className="font-bold text-lg">Login Required</p>
                  <p className="text-sm">
                    Log in to access this service.
                  </p>
                </div>
              </div>
            )}

            <Routes>
              <Route path="/profile" element={<UserProfile />} />
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <HomePage onFeatureClick={handleProtectedFeatureClick} />
                }
              />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/complete-profile"
                element={<CompleteProfilePage />}
              />
              <Route path="/auth/callback" element={<GoogleAuthHandler />} />

              {/* Footer/Info pages */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />

              {/* Services routes */}
              <Route path="/services/tax-planning" element={<TaxPlanning />} />
              <Route path="/services/itr-filing" element={<ITRFiling />} />
              <Route path="/services/gst-filing" element={<GSTFiling />} />
              <Route path="/services/trademark" element={<Trademark />} />
              <Route
                path="/services/business-advisory"
                element={<BusinessAdvisory />}
              />

              {/* Admin Panel routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="trademark" element={<AdminTrademark />} />
                <Route path="business-advisory" element={<AdminBusiness />} />
                <Route path="tax-planning" element={<AdminTaxPlanning />} />
                <Route path="gst" element={<AdminGST />} />
                <Route path="itr" element={<AdminITR />} />
              </Route>
            </Routes>
          </>
        )}
      </main>
      {!isAdminRoute && !isAuthPage && <Footer />}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <LoadFromTop />
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
