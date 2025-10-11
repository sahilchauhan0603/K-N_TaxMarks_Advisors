import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
import Swal from "sweetalert2";
import UserTestimonials from "./UserTestimonials";
import MyServices from "./MyServices";
import MyBills from "./MyBills";
import UserSidebar from "./components/UserSidebar";

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

// This Sidebar component is now replaced by the separate UserSidebar component

// Main UserProfile Component
const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  const [serviceCount, setServiceCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
          profileImage: userData.profileImage || "",
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

  // Fetch service count for badge
  useEffect(() => {
    const fetchServiceCount = async () => {
      try {
        const response = await axios.get("/api/services/user-services");
        setServiceCount(response.data.data.totalServices || 0);
      } catch (err) {
        console.error("Failed to fetch service count:", err);
        // Set count to 0 if there's an error, but don't show error to user
        setServiceCount(0);
      }
    };

    if (user?.email) {
      fetchServiceCount();
    }
  }, [user?.email]);

  // Fetch testimonials and calculate satisfaction rate
  useEffect(() => {
    const fetchSatisfactionRate = async () => {
      try {
        const response = await axios.get("/api/testimonials/my");
        const testimonials = response.data;

        if (testimonials.length === 0) {
          // If no testimonials, show "--" or 0%
          setSatisfactionRate(null);
          return;
        }

        const approvedCount = testimonials.filter((t) => t.isApproved).length;
        const rate = Math.round((approvedCount / testimonials.length) * 100);
        setSatisfactionRate(rate);
      } catch (err) {
        console.error(
          "Failed to fetch testimonials for satisfaction rate:",
          err
        );
        // Default to null if error fetching testimonials
        setSatisfactionRate(null);
      }
    };

    if (user?.email) {
      fetchSatisfactionRate();
    }
  }, [user?.email]);

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

  // Edit Account Function
  const handleEditAccount = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Account Details",
      html: `
        <div style="text-align: left; margin-bottom: 20px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #1e293b;">Current Account Info</h4>
            <p style="margin: 5px 0; color: #64748b;"><strong>Email:</strong> ${
              userProfile?.email || "N/A"
            }</p>
            <p style="margin: 5px 0; color: #64748b;"><strong>Phone:</strong> ${
              userProfile?.phone || "N/A"
            }</p>
            <p style="margin: 5px 0; color: #64748b;"><strong>State:</strong> ${
              userProfile?.state || "N/A"
            }</p>
          </div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
          <input id="swal-input1" class="swal2-input" placeholder="Full Name" value="${
            userProfile?.name || ""
          }" style="margin-bottom: 15px;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Phone:</label>
          <input id="swal-input2" class="swal2-input" placeholder="Phone Number" value="${
            userProfile?.phone || ""
          }" style="margin-bottom: 15px;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">State:</label>
          <select id="swal-input3" class="swal2-input" style="margin-bottom: 15px;">
            <option value="">Select State</option>
            ${STATES_OF_INDIA.map(
              (state) =>
                `<option value="${state}" ${
                  userProfile?.state === state ? "selected" : ""
                }>${state}</option>`
            ).join("")}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Profile",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3b82f6",
      width: "500px",
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const phone = document.getElementById("swal-input2").value;
        const state = document.getElementById("swal-input3").value;

        if (!name.trim()) {
          Swal.showValidationMessage("Name is required");
          return false;
        }

        return { name: name.trim(), phone: phone.trim(), state };
      },
    });

    if (formValues) {
      try {
        const response = await axios.put("/api/user", {
          email: userProfile.email,
          name: formValues.name,
          phone: formValues.phone,
          state: formValues.state,
        });

        if (response.data.success) {
          setUserProfile(response.data.user);
          const updatedUser = { ...user, ...formValues };
          updateUser(updatedUser);

          Swal.fire({
            icon: "success",
            title: "Profile Updated!",
            text: "Your account details have been updated successfully.",
            confirmButtonColor: "#10b981",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            error.response?.data?.message ||
            "Failed to update profile. Please try again.",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // Delete Account Function
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account",
      html: `
        <div style="text-align: left; margin-bottom: 20px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #dc2626;">⚠️ Account Deletion Warning</h4>
            <p style="margin: 5px 0; color: #7f1d1d;">This action will permanently delete your account and all associated data.</p>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #1e293b;">Account to be deleted:</h4>
            <p style="margin: 5px 0; color: #64748b;"><strong>Name:</strong> ${
              userProfile?.name || "N/A"
            }</p>
            <p style="margin: 5px 0; color: #64748b;"><strong>Email:</strong> ${
              userProfile?.email || "N/A"
            }</p>
            <p style="margin: 5px 0; color: #64748b;"><strong>Phone:</strong> ${
              userProfile?.phone || "N/A"
            }</p>
          </div>
          <div style="background: #fffbeb; border: 1px solid #fed7aa; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #d97706;">What will be deleted:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              <li>Your profile information</li>
              <li>All service form submissions</li>
              <li>Your testimonials and suggestions</li>
              <li>Account access and login credentials</li>
            </ul>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete My Account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      width: "550px",
      icon: "warning",
    });

    if (result.isConfirmed) {
      // Second confirmation
      const finalConfirm = await Swal.fire({
        title: "Final Confirmation",
        text: "Are you absolutely sure? This action cannot be undone.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, I understand",
        cancelButtonText: "No, keep my account",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });

      if (finalConfirm.isConfirmed) {
        try {
          await axios.delete("/api/user/delete");

          // Clear user data and logout
          logout();

          Swal.fire({
            icon: "success",
            title: "Account Deleted",
            text: "Your account has been permanently deleted.",
            confirmButtonColor: "#10b981",
          }).then(() => {
            navigate("/");
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Deletion Failed",
            text:
              error.response?.data?.message ||
              "Failed to delete account. Please try again.",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    }
  };

  // Support Modal Function
  const handleSupportModal = () => {
    Swal.fire({
      title: "📋 User Profile Guide",
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px;">
          <div style="margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">👤</span>
              Profile Management
            </h4>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• View and update your personal information</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Edit name, phone number, and state details</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Track your profile completion status</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">🛠️</span>
              My Services
            </h4>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• View all your submitted service requests</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Track GST, ITR, Trademark applications</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Monitor service status and progress</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">⭐</span>
              Testimonials
            </h4>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Share your experience with our services</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Rate our service quality and support</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• Help other users with your feedback</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">⚡</span>
              Quick Actions
            </h4>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• <strong>Edit Account:</strong> Update your profile information quickly</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• <strong>Delete Account:</strong> Permanently remove your account and data</p>
            <p style="color: #64748b; margin: 5px 0; padding-left: 32px;">• <strong>Support:</strong> Get help and guidance (this modal!)</p>
          </div>

          <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h4 style="color: #0c4a6e; margin: 0 0 10px 0; display: flex; align-items: center;">
              <span style="margin-right: 8px;">💡</span>
              Pro Tips
            </h4>
            <p style="color: #0c4a6e; margin: 5px 0; font-size: 14px;">• Keep your profile updated for better service delivery</p>
            <p style="color: #0c4a6e; margin: 5px 0; font-size: 14px;">• Check 'My Services' regularly for status updates</p>
            <p style="color: #0c4a6e; margin: 5px 0; font-size: 14px;">• Share testimonials to help improve our services</p>
          </div>

          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h4 style="color: #dc2626; margin: 0 0 10px 0; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>
              Need More Help?
            </h4>
            <p style="color: #7f1d1d; margin: 5px 0; font-size: 14px;">Contact our support team:</p>
            <p style="color: #7f1d1d; margin: 5px 0; font-size: 14px;">📧 Email: support@kntaxmarkadvisors.com</p>
            <p style="color: #7f1d1d; margin: 5px 0; font-size: 14px;">📱 Phone: +91-XXXXXXXXXX</p>
          </div>
        </div>
      `,
      confirmButtonText: "Got it!",
      confirmButtonColor: "#3b82f6",
      width: "600px",
      showCloseButton: true,
      focusConfirm: false,
    });
  };

  // Profile Image Upload Function
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select an image file (JPG, PNG, GIF, WEBP)",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Please select an image smaller than 5MB",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setImageUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Create FormData for upload
      const formData = new FormData();
      formData.append("profileImage", file);

      // Upload to backend
      const response = await axios.post(
        "/api/user/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update user profile with new image
        setUserProfile((prev) => ({
          ...prev,
          profileImage: response.data.profileImage,
        }));

        // Update user in context
        const updatedUser = {
          ...user,
          profileImage: response.data.profileImage,
        };
        updateUser(updatedUser);

        Swal.fire({
          icon: "success",
          title: "Profile Image Updated!",
          text: "Your profile image has been updated successfully.",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setImagePreview(null);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error.response?.data?.message ||
          "Failed to upload image. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  // // Helper functions for section titles and descriptions
  // const getSectionTitle = () => {
  //   switch (activeSection) {
  //     case "profile":
  //       return "Profile Overview";
  //     case "services":
  //       return "My Services";
  //     case "testimonials":
  //       return "My Testimonials";
  //     case "bills":
  //       return "My Bills";
  //     default:
  //       return "Profile Overview";
  //   }
  // };

  // const getSectionDescription = () => {
  //   switch (activeSection) {
  //     case "profile":
  //       return "Manage your personal information and account settings";
  //     case "services":
  //       return "View and track your applied services";
  //     case "testimonials":
  //       return "Manage your testimonials and feedback";
  //     case "bills":
  //       return "View your billing information and payment history";
  //     default:
  //       return "Manage your personal information and account settings";
  //   }
  // };

  // Clean Profile Overview matching MyServices pattern
  const ProfileOverview = () => (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Overview</h1>
          <p className="text-gray-600">Manage your account and personal information</p>
        </div>
        <button
          onClick={() => fetchUserProfile(true)}
          disabled={profileLoading}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${profileLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold">Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* Services Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{serviceCount}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        {/* Satisfaction Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {satisfactionRate !== null ? `${satisfactionRate}%` : "--"}
              </p>
            </div>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">Active</p>
            </div>
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
          </div>
        </div>

        {/* Bills Summary Card */}
        <button
          onClick={() => setActiveSection("bills")}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bills</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">₹23.5k</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 group-hover:text-purple-600" />
          </div>
        </button>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Image */}
            <div className="relative group flex-shrink-0">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {userProfile?.profileImage || imagePreview ? (
                  <img
                    src={imagePreview || userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              {/* Hidden file input for image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {userProfile?.name || "User"}
                </h4>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {userProfile?.email}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {/* <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  Premium User
                </span> */}
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  Verified Account
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Active Status
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone Number</p>
                  <p className="text-gray-900 mt-1">{userProfile?.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900 mt-1">{userProfile?.state || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={handleEditAccount}
              className="flex items-center p-4 cursor-pointer border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>

            <button
              onClick={handleSupportModal}
              className="flex items-center p-4 cursor-pointer border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Get Support</p>
                <p className="text-sm text-gray-600">Help and guidance</p>
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center p-4 cursor-pointer border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600">Remove permanently</p>
              </div>
            </button>
          </div>
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
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-3 lg:mb-4 overflow-hidden">
                {userProfile?.profileImage || imagePreview ? (
                  <img
                    src={imagePreview || userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-2xl lg:rounded-3xl"
                  />
                ) : (
                  <User className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-100 cursor-pointer">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploading}
                />
              </label>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Profile Picture
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              {imageUploading
                ? "Uploading..."
                : "Click the camera icon to upload a new photo"}
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
        return <MyServices />;
      case "testimonials":
        return <UserTestimonials />;
      case "bills":
        return <MyBills />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <UserSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          serviceCount={serviceCount}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 sm:p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
