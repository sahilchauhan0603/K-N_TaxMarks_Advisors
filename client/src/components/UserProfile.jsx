import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, X, LogOut, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// States of India
const STATES_OF_INDIA = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const UserProfile = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, setUser } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Initialize form with user data
    if (user) {
      setForm({
        name: user.name || user.given_name || user.first_name || "",
        email: user.email || "",
        phone: user.phone || user.mobile || "",
        state: user.state || ""
      });
    }
  }, [user]);
  // ...existing code...
  // Profile header UI
  // Replace the mock header with real user info
  // ...existing code...

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Send PUT request to update profile
      const res = await import("../utils/axios").then(ax => ax.default.put("/api/auth/user", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        state: form.state
      }));
      if (res.data && res.data.success) {
        setUser(res.data.user);
        setForm({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          phone: res.data.user.phone || "",
          state: res.data.user.state || ""
        });
        setSuccess("Profile updated successfully!");
        setEditing(false);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(res.data.message || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      state: user.state || "",
    });
    setEditing(false);
    setError("");
    setSuccess("");
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white relative">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{form.name || "Your Name"}</h2>
                <p className="text-blue-100 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {form.email}
                </p>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="absolute top-6 right-6">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-green-800 font-medium">Success</h4>
                  <p className="text-green-700 text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <User className="w-4 h-4 mr-2 text-slate-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    editing 
                      ? 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                />
                <p className="text-xs text-slate-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Email address cannot be changed for security reasons
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    editing 
                      ? 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* State/Province */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  State/Province
                </label>
                {editing ? (
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white transition-all duration-200"
                  >
                    <option value="">Select your state</option>
                    {STATES_OF_INDIA.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.state || "Not specified"}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                  />
                )}
              </div>
            </div>

            {/* Logout Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-800">Account Actions</h3>
                  <p className="text-sm text-slate-600 mt-1">Manage your account settings</p>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 border border-red-200 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Confirm Logout</h3>
                  <p className="text-sm text-slate-600">Are you sure you want to logout?</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">You will need to sign in again to access your account.</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;