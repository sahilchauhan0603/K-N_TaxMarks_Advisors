import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { FaUserShield, FaEnvelope, FaKey, FaLock, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import OTPInput from "../../../components/OTPInput";

// Get allowed admin emails from environment variable
const getAllowedEmails = () => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS;
  if (!adminEmails) {
    console.error('WARNING: VITE_ADMIN_EMAILS not set in environment variables!');
    return [];
  }
  return adminEmails.split(',').map(email => email.trim()).filter(email => email.length > 0);
};

const allowedEmails = getAllowedEmails();

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [hasFormData, setHasFormData] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // OTP Timer Effect
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((timer) => {
          if (timer <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  // Page reload warning effect
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData && !isRedirecting) {
        e.preventDefault();
        e.returnValue = 'Your data might get lost. Do you want to reload?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasFormData, isRedirecting]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!allowedEmails.includes(email)) {
      setError("not-allowed");
      setHasFormData(true);
      return;
    }
    setLoading(true);
    setHasFormData(true);
    try {
      await axios.post("/api/admin/send-otp", { email });
      setStep(2);
      setError("");
      setInfo("OTP sent to your email. Please check your inbox.");
      // Start 3-minute timer (180 seconds) for admin OTP
      setOtpTimer(180);
      setCanResendOtp(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (!canResendOtp) return;

    setLoading(true);
    setError("");
    setInfo("");

    try {
      await axios.post("/api/admin/send-otp", { email });
      setInfo("New OTP sent to your email. Please check your inbox.");
      // Restart 3-minute timer
      setOtpTimer(180);
      setCanResendOtp(false);
      setOtp(""); // Clear previous OTP
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      const res = await axios.post("/api/admin/verify-otp", { email, otp });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("adminLoginTime", new Date().toISOString());
      
      // Set redirecting flag to prevent beforeunload warning
      setIsRedirecting(true);
      setHasFormData(false);
      
      // Small delay to ensure state updates before redirect
      setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(""); // Clear the OTP input for retry
      setLoading(false);
    }
  };

  // Function to clear error messages
  const clearError = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <FaUserShield className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="mt-1.5 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-1.5 text-center text-sm text-gray-600">
          Sign in to access the admin panel
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full ml-4 mr-4 sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {error === "not-allowed" && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 border border-red-200">
              <FaLock className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <span>This user is not allowed to access the admin panel.</span>
              <button
                className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200"
                onClick={clearError}
                title="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}
          {info && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-green-50 text-green-800 border border-green-200">
              <FaKey className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
              <span>{info}</span>
            </div>
          )}
          {error && error !== "not-allowed" && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 border border-red-200">
              <FaLock className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <span>{error}</span>
              <button
                className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200"
                onClick={clearError}
                title="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="admin-email"
                    name="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Enter admin email"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaLock className="mr-2" />
                  )}
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {/* Show Email (Read-only) */}
              <div>
                <label
                  htmlFor="admin-email-display"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="admin-email-display"
                    name="admin-email-display"
                    type="email"
                    value={email}
                    readOnly
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  {otpTimer > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      Expires in: {formatTimer(otpTimer)}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                    autoFocus={true}
                  />
                </div>

                {/* Resend OTP Button */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Didn't receive the code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResendOtp || loading}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      canResendOtp && !loading
                        ? "text-blue-600 hover:text-blue-500 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
                {otpTimer === 0 && canResendOtp && (
                  <div className="mb-2">
                    <span className="text-sm text-red-600">
                      OTP has expired. Please request a new one.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpTimer(0);
                    setCanResendOtp(false);
                    setOtp("");
                    setError("");
                    setInfo("");
                    setHasFormData(false); // Reset form data flag
                    setIsRedirecting(false); // Reset redirecting flag
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaUserShield className="mr-2" />
                  )}
                  {loading ? "Verifying..." : "Login"}
                </button>
              </div>
            </form>
          )}
          <div className="mt-8 text-xs text-slate-400 text-center">
            Only authorized admin emails can access this panel.
            <br />
            {step === 1
              ? "For security, OTP is valid for 3 minutes."
              : "You can resend OTP after it expires."}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Back to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;