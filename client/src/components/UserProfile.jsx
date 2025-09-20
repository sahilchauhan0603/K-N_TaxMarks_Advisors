import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

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

// Enhanced Sidebar Component
const Sidebar = ({ activeSection, onSectionChange, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      key: "profile",
      label: "Profile Overview",
      icon: <User className="w-5 h-5" />,
      description: "View your profile",
    },
    {
      key: "edit",
      label: "Edit Profile",
      icon: <Edit3 className="w-5 h-5" />,
      description: "Update your information",
    },
    {
      key: "services",
      label: "My Services",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Manage services",
      comingSoon: true,
    },
    {
      key: "bills",
      label: "My Bills",
      icon: <Receipt className="w-5 h-5" />,
      description: "View billing history",
      comingSoon: true,
    },
  ];

  const handleLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="w-full lg:w-80 h-full bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Account Settings</h2>
              <p className="text-blue-100 text-sm">Manage your profile</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onSectionChange(item.key)}
                  disabled={item.comingSoon}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    activeSection === item.key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                      : item.comingSoon
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-100 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center p-4 relative z-10">
                    <div
                      className={`mr-4 transition-transform duration-300 ${
                        activeSection === item.key
                          ? "scale-110"
                          : "group-hover:scale-105"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        {item.comingSoon && (
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">
                            Soon
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          activeSection === item.key
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {activeSection === item.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 backdrop-blur-sm" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 flex-shrink-0 p-4 border-t border-gray-200">
          <Link
            to="/"
            className="w-full group bg-gradient-to-r from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 hover:shadow-md flex items-center text-blue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <div className="text-left">
              <span className="font-medium text-sm">Home</span>
              <p className="text-xs text-blue-500 mt-1">Back to Home</p>
            </div>
          </Link>
        </div>
        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full group bg-gradient-to-r cursor-pointer from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 hover:border-red-300 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center text-red-600">
              <LogOut className="w-5 h-5 mr-4 transition-transform duration-300 group-hover:scale-110" />
              <div className="text-left">
                <span className="font-medium text-sm">Sign Out</span>
                <p className="text-xs text-red-500 mt-1">End your session</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to sign out of your account?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 cursor-pointer py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 cursor-pointer py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main UserProfile Component
const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

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

  // Fetch user profile data from backend
  const fetchUserProfile = async () => {
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
      setForm(profileData);
      setOriginalForm(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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

  // Profile Overview Component
  const ProfileOverview = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10 flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {userProfile?.name || "Your Name"}
            </h1>
            <p className="text-blue-100 flex items-center mb-3">
              <Mail className="w-4 h-4 mr-2" />
              {userProfile?.email}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                ✨ Premium User
              </span>
              <span className="bg-emerald-500/90 px-3 py-1 rounded-full backdrop-blur-sm">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone Number</h3>
                <p className="text-sm text-gray-500">Contact information</p>
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {userProfile?.phone || "Not provided"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-sm text-gray-500">State/Province</p>
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {userProfile?.state || "Not specified"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <button
            onClick={fetchUserProfile}
            disabled={profileLoading}
            className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200 disabled:opacity-50"
            title="Refresh profile data"
          >
            <div className={`w-4 h-4 ${profileLoading ? "animate-spin" : ""}`}>
              ↻
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSectionChange("edit")}
            className="bg-white hover:bg-gray-50 p-4 cursor-pointer rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md text-left"
          >
            <Edit3 className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Edit Profile</p>
            <p className="text-sm text-gray-500">Update your information</p>
          </button>
          <button className="bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md text-left cursor-not-allowed">
            <Settings className="w-6 h-6 text-gray-400 mb-2" />
            <p className="font-medium text-gray-500">Settings</p>
            <p className="text-sm text-gray-400">Coming soon</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Profile Component
  const EditProfile = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Edit Your Profile</h2>
            <p className="text-indigo-100">Update your personal information</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Edit3 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-800 font-medium">Success</h4>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-lg ${
                fieldErrors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30"
                  : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white hover:border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-sm flex items-center mt-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 text-lg"
            />
            <p className="text-xs text-gray-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-2" />
              Email address cannot be changed for security reasons
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-lg ${
                fieldErrors.phone
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30"
                  : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white hover:border-gray-300"
              }`}
              placeholder="Enter your phone number (e.g., +91 98765 43210)"
            />
            {fieldErrors.phone && (
              <p className="text-red-600 text-sm flex items-center mt-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              State/Province
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white hover:border-gray-300 transition-all duration-200 text-lg"
            >
              <option value="">Select your state</option>
              {STATES_OF_INDIA.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Changes Indicator */}
          {hasChanges() && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                You have unsaved changes. Don't forget to save!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges()}
              className="flex-1 px-6 py-4 bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-2">
      <div className="max-w-7xl mx-auto h-[calc(100vh-1.5rem)]">
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-2 h-full">
          {/* Sidebar - Fixed Height */}
          <div className="lg:flex-shrink-0 lg:h-full">
            <div className="h-full lg:sticky lg:top-8">
              <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onLogout={logout}
              />
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="transition-all duration-500 ease-in-out">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
