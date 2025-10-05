import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  LogOut,
  ArrowLeft,
  Check,
  AlertCircle,
  Briefcase,
  Receipt,
  Settings,
  Camera,
  Sparkles,
  Clock,
  Menu,
  ChevronRight,
  Home,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  Star,
  Activity,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
import UserTestimonials from "./UserTestimonials";

// States of India
const STATES_OF_INDIA = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

// Enhanced Responsive Collapsible Sidebar with Improved UI
const Sidebar = ({
  activeSection,
  onSectionChange,
  onLogout,
  showLogoutModal,
  setShowLogoutModal,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      key: "profile",
      label: "Profile Overview",
      icon: (
        <User
          className={`transition-all duration-200 ${
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
      ),
      description: "View your profile",
      badge: null,
    },
    // {
    //   key: "edit",
    //   label: "Edit Profile",
    //   icon: (
    //     <Edit3
    //       className={`transition-all duration-200 ${
    //         isCollapsed ? "w-5 h-5" : "w-4 h-4"
    //       }`}
    //     />
    //   ),
    //   description: "Update your information",
    //   badge: null,
    // },
    // {
    //   key: "security",
    //   label: "Security",
    //   icon: (
    //     <Shield
    //       className={`transition-all duration-200 ${
    //         isCollapsed ? "w-5 h-5" : "w-4 h-4"
    //       }`}
    //     />
    //   ),
    //   description: "Privacy & security",
    //   comingSoon: true,
    //   badge: "New",
    // },
    // {
    //   key: "notifications",
    //   label: "Notifications",
    //   icon: (
    //     <Bell
    //       className={`transition-all duration-200 ${
    //         isCollapsed ? "w-5 h-5" : "w-4 h-4"
    //       }`}
    //     />
    //   ),
    //   description: "Manage notifications",
    //   comingSoon: true,
    // },
    {
      key: "services",
      label: "My Services",
      icon: (
        <Briefcase
          className={`transition-all duration-200 ${
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
      ),
      description: "Manage services",
      comingSoon: true,
      badge: "3",
    },
    {
      key: "testimonials",
      label: "My Testimonials",
      icon: (
        <Star
          className={`transition-all duration-200 ${
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
      ),
      description: "Manage testimonials",
      badge: null,
    },
    {
      key: "bills",
      label: "My Bills",
      icon: (
        <CreditCard
          className={`transition-all duration-200 ${
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
      ),
      description: "Billing & payments",
      comingSoon: true,
    },
  ];

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const handleLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Enhanced Full-Screen Glassmorphism Sidebar */}
      <div
        className={`
        ${isCollapsed ? "w-16" : "w-64"} 
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        fixed lg:relative top-0 left-0 lg:top-auto lg:left-auto
        h-screen lg:h-full transition-all duration-300 ease-in-out z-50 lg:z-auto
      `}
      >
        <div className="h-full bg-white/95 backdrop-blur-2xl border-r border-white/30 lg:border lg:border-white/30 lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
          {/* Enhanced Glassmorphism overlay with improved gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" />

          {/* Enhanced Sidebar Header */}
          <div className="relative z-10 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-2xl text-white flex-shrink-0">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${
                isCollapsed ? "p-2" : "p-4"
              }`}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "space-x-3"
                }`}
              >
                {!isCollapsed && (
                  <div className="flex-1">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Account Hub
                    </h2>
                    <p className="text-blue-100/80 text-xs mt-0.5">
                      Manage your profile
                    </p>
                  </div>
                )}
              </div>

              {/* Collapse Toggle Button - Desktop Only  */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden lg:flex cursor-pointer w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110`}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-white" />
                ) : (
                  <ArrowLeft className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Enhanced Navigation Menu */}
          <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
            <div
              className={`transition-all duration-300 ${
                isCollapsed ? "p-1" : "p-3"
              }`}
            >
              <nav className={`space-y-1 ${isCollapsed ? "space-y-2" : ""}`}>
                {menuItems.map((item, index) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSectionChange(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={item.comingSoon}
                    className={`w-full cursor-pointer group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-[1.01] ${
                      activeSection === item.key
                        ? "bg-gradient-to-r from-blue-500/95 to-purple-600/95 text-white shadow-lg backdrop-blur-xl border border-blue-400/50"
                        : item.comingSoon
                        ? "bg-gray-50/60 text-gray-400 cursor-not-allowed backdrop-blur-sm border border-gray-200/30"
                        : "bg-white/70 hover:bg-white/90 text-gray-700 hover:text-blue-700 border border-white/40 hover:border-blue-200/60 hover:shadow-lg backdrop-blur-lg"
                    }`}
                    title={isCollapsed ? item.label : ""}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={`flex items-center relative z-10 transition-all duration-300 ${
                        isCollapsed ? "justify-center p-2" : "p-3"
                      }`}
                    >
                      <div
                        className={`transition-all duration-300 ${
                          isCollapsed ? "" : "mr-4"
                        } ${
                          activeSection === item.key
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      >
                        {item.icon}
                      </div>

                      {!isCollapsed && (
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-medium text-xs truncate">
                              {item.label}
                            </span>
                            <div className="flex items-center space-x-2 ml-2">
                              {item.badge && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                                    item.badge === "New"
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                      : "bg-blue-100 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {item.comingSoon && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium border border-amber-200">
                                  Soon
                                </span>
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${
                              activeSection === item.key
                                ? "text-blue-100/90"
                                : "text-gray-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Active indicator */}
                    {activeSection === item.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/25 to-purple-500/25 backdrop-blur-sm animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Bottom Actions */}
          <div
            className={`relative z-10 flex-shrink-0 border-t border-white/30 bg-white/10 backdrop-blur-xl transition-all duration-300 ${
              isCollapsed ? "p-2 space-y-2" : "p-4 space-y-3"
            }`}
          >
            {/* Back to Home Button */}
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full group bg-gradient-to-r from-slate-50/90 to-blue-50/90 hover:from-slate-100 hover:to-blue-100 border border-blue-200/60 hover:border-blue-300/80 rounded-2xl transition-all duration-300 hover:shadow-xl flex items-center text-blue-600 backdrop-blur-lg hover:scale-[1.02] ${
                isCollapsed ? "p-3 justify-center" : "p-4"
              }`}
              title={isCollapsed ? "Back to Home" : ""}
            >
              <Home
                className={`transition-all duration-300 group-hover:scale-110 ${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-4"
                }`}
              />
              {!isCollapsed && (
                <div className="text-left">
                  <span className="font-semibold text-sm">Home</span>
                  <p className="text-xs text-blue-500/80 mt-1">
                    Back to Dashboard
                  </p>
                </div>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                setShowLogoutModal(true);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full cursor-pointer group bg-gradient-to-r from-red-50/90 to-rose-50/90 hover:from-red-100 hover:to-rose-100 border border-red-200/60 hover:border-red-300/80 rounded-2xl transition-all duration-300 hover:shadow-xl backdrop-blur-lg hover:scale-[1.02] ${
                isCollapsed ? "p-3 justify-center" : "p-4"
              }`}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <div
                className={`flex items-center text-red-600 ${
                  isCollapsed ? "" : ""
                }`}
              >
                <LogOut
                  className={`transition-all duration-300 group-hover:scale-110 ${
                    isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-4"
                  }`}
                />
                {!isCollapsed && (
                  <div className="text-left">
                    <span className="font-semibold text-sm">Sign Out</span>
                    <p className="text-xs text-red-500/80 mt-1">
                      End your session
                    </p>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main UserProfile Component
const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });
  const [originalForm, setOriginalForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  //  Fetch user profile (runs only when user.email changes or on manual refresh)
  const fetchUserProfile = useCallback(
    async (forceRefresh = false) => {
      if (!user?.email) return;

      try {
        setProfileLoading(true);
        const response = await axios.get(`/api/user?email=${user.email}`);
        const userData = response.data;

        const profileData = {
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          state: userData.state || "",
        };

        setUserProfile(userData);

        // ✅ Only set form if first load or explicitly forcing refresh
        if (forceRefresh || !originalForm.name) {
          setForm(profileData);
          setOriginalForm(profileData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    },
    [user?.email, originalForm.name] // stable, won't trigger on every keystroke
  );
  // Run only once when profile is empty (initial load)
  useEffect(() => {
    if (user?.email && !userProfile) {
      fetchUserProfile(false);
    }
  }, [user?.email, userProfile, fetchUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear field errors when user starts typing
    setFieldErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });

    // Clear general error when user makes changes
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (form.name.trim().length < 2 || form.name.trim().length > 50) {
      errors.name = "Name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }

    if (form.phone && !/^(\+91|91|0)?[789]\d{9}$/.test(form.phone.trim())) {
      errors.phone = "Please enter a valid Indian phone number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasChanges = () => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    if (!hasChanges()) {
      setError("No changes detected");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      const response = await axios.put("/api/user", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        state: form.state,
      });

      if (response.data.success) {
        // Update local state with new data
        setUserProfile(response.data.user);
        setOriginalForm(form);
        setSuccess("Profile updated successfully! 🎉");

        // Update user data in context and localStorage
        const updatedUser = { ...user, ...form };
        updateUser(updatedUser);

        // Switch back to profile view after successful update
        setTimeout(() => {
          setSuccess("");
          setActiveSection("profile");
        }, 2000);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(originalForm);
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  // Mobile-Responsive Profile Overview Component
  const ProfileOverview = () => (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
      {/* Mobile-Responsive Error Message */}
      {error && (
        <div className="p-4 sm:p-6 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl lg:rounded-3xl flex items-start space-x-3 sm:space-x-4 shadow-xl">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-red-800 font-semibold text-base sm:text-lg">
              Error
            </h4>
            <p className="text-red-700 text-xs sm:text-sm mt-1 sm:mt-2">
              {error}
            </p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700 p-1 sm:p-2 rounded-xl hover:bg-red-100/50 transition-all duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Mobile-Optimized Hero Profile Card */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 text-white overflow-hidden shadow-xl">
        {/* Glassmorphism decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -ml-12 -mb-12" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Camera className="w-4 h-4" />
              </button>
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Check className="w-2 h-2 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {userProfile?.name || "Your Name"}
              </h1>
              <p className="text-blue-100 flex items-center mb-3 text-sm lg:text-base">
                <Mail className="w-4 h-4 mr-2" />
                {userProfile?.email}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/30 font-medium text-xs">
                  <Star className="w-3 h-3 inline mr-1" />
                  Premium User
                </span>
                <span className="bg-emerald-500/90 px-3 py-1 rounded-lg backdrop-blur-sm border border-emerald-400/50 font-medium text-xs">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Verified Account
                </span>
                <span className="bg-purple-500/80 px-3 py-1 rounded-lg backdrop-blur-sm border border-purple-400/50 font-medium text-xs">
                  <Activity className="w-4 h-4 inline mr-2" />
                  Active
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-2">
              <div className="text-center">
                <div className="text-lg font-bold">12</div>
                <div className="text-blue-200 text-xs">Services</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">98%</div>
                <div className="text-blue-200 text-xs">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contact Info Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Phone</h3>
                <p className="text-sm text-gray-500">Contact number</p>
              </div>
            </div>
            {/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            {userProfile?.phone || "Not provided"}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
            Verified
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                <p className="text-sm text-gray-500">Current state</p>
              </div>
            </div>
            {/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            {userProfile?.state || "Not specified"}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
            India
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Status</h3>
                <p className="text-sm text-gray-500">Account level</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 cursor-pointer text-gray-400" />
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">Premium</p>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
            Active since 2024
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200/50 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Sparkles className="w-7 h-7 mr-3 text-purple-600" />
              Quick Actions
            </h3>
            <p className="text-gray-600 mt-2">
              Manage your account efficiently
            </p>
          </div>
          <button
            onClick={() => fetchUserProfile(true)}
            disabled={profileLoading}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 cursor-pointer rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            title="Refresh profile data"
          >
            <div className={`w-6 h-6 ${profileLoading ? "animate-spin" : ""}`}>
              ↻
            </div>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <button
            onClick={() => handleSectionChange("edit")}
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm p-6 cursor-pointer rounded-2xl border border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-2">Edit Profile</p>
            <p className="text-sm text-gray-600">Update your information</p>
          </button> */}

          <button className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-left cursor-not-allowed opacity-75">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-700 text-lg mb-2">Settings</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </button>

          <button className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-left cursor-not-allowed opacity-75">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-700 text-lg mb-2">Support</p>
            <p className="text-sm text-gray-500">Get help</p>
          </button>

          <button className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-left cursor-not-allowed opacity-75">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-700 text-lg mb-2">
              Notifications
            </p>
            <p className="text-sm text-gray-500">Manage alerts</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced Mobile-Responsive Edit Profile Component
  const EditProfile = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Mobile-Optimized Header Section */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Edit Profile
          </h2>
          <button
            onClick={() => handleSectionChange("profile")}
            className="flex cursor-pointer items-center px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-gray-600 hover:text-gray-800 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl font-medium transition-all duration-200 border border-gray-200/50 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Overview</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Update your personal information and preferences
        </p>
      </div>

      {/* Success Message */}
      {/* {success && (
        <div className="p-6 bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl flex items-start space-x-4 shadow-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-emerald-800 font-semibold text-lg">Success!</h4>
            <p className="text-emerald-700 text-sm mt-1">{success}</p>
          </div>
          <button
            onClick={() => setSuccess("")}
            className="text-emerald-500 hover:text-emerald-700 p-2 rounded-xl hover:bg-emerald-100/50 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )} */}

      {/* Error Message */}
      {/* {error && (
        <div className="p-6 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-3xl flex items-start space-x-4 shadow-xl">
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-red-800 font-semibold text-lg">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-100/50 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )} */}

      {/* Mobile-Responsive Edit Form */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Mobile-Optimized Profile Picture Section */}
          <div className="text-center pb-6 lg:pb-8 border-b border-gray-100">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-3 lg:mb-4">
                <User className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-100"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Profile Picture
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Click the camera icon to upload a new photo
            </p>
          </div>

          {/* Mobile-Responsive Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Name Field */}
            <div className="lg:col-span-2">
              <label
                htmlFor="name"
                className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600" />
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg font-medium placeholder-gray-400 ${
                    fieldErrors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
              </div>
              {fieldErrors.name && (
                <p className="text-red-600 text-xs sm:text-sm flex items-center mt-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  className="w-full px-4 py-3 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl bg-gray-50/80 backdrop-blur-sm cursor-not-allowed text-base sm:text-lg font-medium text-gray-600"
                  disabled
                />
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-emerald-600" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg font-medium placeholder-gray-400 ${
                    fieldErrors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
              </div>
              {fieldErrors.phone && (
                <p className="text-red-600 text-xs sm:text-sm flex items-center mt-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* State Field */}
            <div className="lg:col-span-2">
              <label
                htmlFor="state"
                className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-600" />
                State / Province
              </label>
              <div className="relative">
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg font-medium appearance-none cursor-pointer"
                >
                  <option value="">Select your state</option>
                  {STATES_OF_INDIA.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
                <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Changes Indicator */}
          {hasChanges() && (
            <div className="p-4 sm:p-6 bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 rounded-2xl lg:rounded-3xl shadow-lg">
              <p className="text-amber-700 text-xs sm:text-sm flex items-center font-medium">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                You have unsaved changes. Don't forget to save!
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-6 bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl flex items-start space-x-4 shadow-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-emerald-800 font-semibold text-lg">
                  Success!
                </h4>
                <p className="text-emerald-700 text-sm mt-1">{success}</p>
              </div>
              <button
                onClick={() => setSuccess("")}
                className="text-emerald-500 hover:text-emerald-700 p-2 rounded-xl hover:bg-emerald-100/50 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-3xl flex items-start space-x-4 shadow-xl">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-red-800 font-semibold text-lg">Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-100/50 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mobile-Responsive Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4 pt-6 lg:pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <div className="flex items-center justify-center space-x-2">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline cursor-pointer">
                  Cancel Changes
                </span>
                <span className="sm:hidden">Cancel</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !hasChanges()}
              className="w-full cursor-pointer sm:w-auto px-8 py-3 lg:px-10 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold rounded-xl lg:rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <div className="flex items-center justify-center space-x-2 lg:space-x-3">
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Saving Changes...</span>
                    <span className="sm:hidden">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Mobile-Responsive Additional Info */}
          <div className="text-center pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Your information is encrypted and securely stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Coming Soon Component
  const ComingSoon = ({ title, description, icon: Icon }) => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl mb-6">
        <Icon className="w-10 h-10 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Coming Soon</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileOverview />;
      case "edit":
        return <EditProfile />;
      case "services":
        return (
          <ComingSoon
            title="My Services"
            description="Manage and view all your service subscriptions and packages in one place."
            icon={Briefcase}
          />
        );
      case "testimonials":
        return <UserTestimonials />;
      case "bills":
        return (
          <ComingSoon
            title="My Bills"
            description="Access your billing history, invoices, and payment information."
            icon={Receipt}
          />
        );
      default:
        return <ProfileOverview />;
    }
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Fixed Height Container */}
      <div className="h-full w-full lg:max-w-7xl lg:mx-auto lg:py-2 lg:px-2">
        {/* Fixed Height Layout */}
        <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-1rem)] relative">
          {/* Desktop Sidebar - Fixed Height */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="h-full">
              <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onLogout={logout}
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
              />
            </div>
          </div>

          {/* Mobile Sidebar - Full Screen Overlay */}
          <div className="lg:hidden">
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onLogout={logout}
              showLogoutModal={showLogoutModal}
              setShowLogoutModal={setShowLogoutModal}
            />
          </div>

          {/* Main Content - Fixed Height with Scrollable Content */}
          <div className="flex-1 min-w-0 flex flex-col lg:ml-4 h-full">
            {/* Fixed Height Content Container with Scroll */}
            <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-none lg:rounded-2xl border-0 lg:border lg:border-white/20 shadow-none lg:shadow-xl overflow-hidden h-full">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="p-2 sm:p-3 md:p-4 lg:p-5 pt-3 sm:pt-4 lg:pt-5 pb-4">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Logout Confirmation Modal with Glassmorphism */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[9999] p-4 animate-in fade-in-0 duration-300">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in fade-in-0 zoom-in-95 duration-300 border border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LogOut className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sign Out Confirmation
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to sign out of your account? Any unsaved
                changes will be lost.
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 cursor-pointer px-6 py-4 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 cursor-pointer px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Global Styles with Responsive Improvements */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.4);
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.6);
          }
          
          /* Responsive animations */
          @media (max-width: 1024px) {
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
          }
          
          /* Smooth transitions for mobile */
          @media (max-width: 768px) {
            * {
              -webkit-tap-highlight-color: transparent;
            }
          }
          
          /* Enhanced glassmorphism backdrop effects */
          @supports (backdrop-filter: blur(20px)) {
            .backdrop-blur-2xl {
              backdrop-filter: blur(20px);
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default UserProfile;
