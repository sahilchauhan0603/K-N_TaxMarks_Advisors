import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import logo from "../../assets/logo.png";

const ForgotPasswordPage = () => {
  // Timer for OTP expiry
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Timer effect
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

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOTP = async () => {
    if (!email) {
      setMessageType("error");
      setMessage("Please enter your email");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/forgot-password", { email });
      if (res.data.success) {
        setStep(2);
        setMessageType("success");
        setMessage("OTP sent to your email. Please check your inbox.");
        setOtpTimer(600); // 10 minutes
        setCanResendOtp(false);
      } else {
        setMessageType("error");
        setMessage(res.data.message || "Error sending OTP");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred. Please try again. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        setMessageType("success");
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessageType("error");
        setMessage(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred. Please try again. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex overflow-hidden">
      {/* Left Side - Image/Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center px-8 py-6 text-gray-800 w-full">
          <div className="mb-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/95 backdrop-blur-xl p-2 rounded-2xl border-2 border-blue-300/50 shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:scale-105">
              <img
                src={logo}
                alt="K-N Taxmarks Advisors"
                className="h-16 w-auto"
              />
            </div>
          </div>

          <div className="mb-4">
            <svg
              className="w-48 h-48"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="#EEF2FF"
                fillOpacity="0.5"
                // stroke="black"
              />
              {/* Lock icon */}
              <rect
                x="150"
                y="180"
                width="100"
                height="80"
                rx="8"
                fill="#0EA5E9"
                fillOpacity="0.9"
              />
              <path
                d="M170 180 L170 150 Q170 120 200 120 Q230 120 230 150 L230 180"
                stroke="#0EA5E9"
                strokeWidth="10"
                fill="none"
                strokeOpacity="0.9"
              />
              <circle cx="200" cy="220" r="12" fill="#237b5d" />
              <rect
                x="197"
                y="220"
                width="6"
                height="20"
                rx="3"
                fill="#2ccb96"
              />
              {/* Key icon */}
              <circle cx="300" cy="200" r="25" fill="#60A5FA" />
              <rect
                x="300"
                y="200"
                width="60"
                height="12"
                rx="6"
                fill="#60A5FA"
              />
              <rect x="340" y="195" width="10" height="8" fill="#60A5FA" />
              <rect x="355" y="195" width="10" height="8" fill="#60A5FA" />
            </svg>
          </div>

          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2 drop-shadow-sm text-gray-800">
              Secure Password Reset
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              We'll help you reset your password securely. Follow the simple
              steps to regain access to your account.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-1.5">
                <FiShield className="text-green-500" />
                <span className="font-medium">Encrypted Process</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiLock className="text-blue-600" />
                <span className="font-medium">OTP Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-12 xl:px-16 relative">
          {/* Back to Login Link */}
          <div className="absolute top-6 left-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Logo for mobile */}
            <Link to="/" className="flex justify-center mb-6 lg:hidden">
              <div className="bg-white p-2 rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <img
                  src={logo}
                  alt="K-N Taxmarks Advisors"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </Link>

            <h2 className="text-center text-3xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 1
                ? "Enter your email to receive a verification code"
                : "Enter the code we sent you and your new password"}
            </p>

            {/* Trust Indicators */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiShield className="text-green-600" />
                <span>Secure Process</span>
              </div>
              <div className="h-3 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <FiLock className="text-blue-600" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          <div className="mt-8 ml-4 mr-4 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
              {message && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    messageType === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}
                >
                  {messageType === "error" ? (
                    <FiAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                  )}
                  <span>{message}</span>
                </div>
              )}

              {step === 1 ? (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-64 flex justify-center cursor-pointer py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
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
                        <FiMail className="mr-2" />
                      )}
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Show user email (read-only) */}
                  <div>
                    <label
                      htmlFor="email-display"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email-display"
                        name="email-display"
                        type="email"
                        value={email}
                        readOnly
                        className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Verification Code
                      </label>
                      {otpTimer > 0 && (
                        <span className="text-sm text-blue-600 font-medium">
                          Expires in: {formatTimer(otpTimer)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        placeholder="Enter the 6-digit code"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Check your email for the verification code we sent to{" "}
                      {email}
                    </p>
                    {otpTimer === 0 && canResendOtp && (
                      <div className="mb-2">
                        <span className="text-sm text-red-600">
                          OTP has expired. Please request a new one.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {/* Password requirements description */}
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <strong>Password requirements:</strong>
                      <ul className="list-disc ml-5">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter (A-Z)</li>
                        <li>One lowercase letter (a-z)</li>
                        <li>One digit (0-9)</li>
                        <li>One special character (!@#$%^&amp;* etc.)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-center">
                      <button
                        onClick={handleResetPassword}
                        disabled={isLoading}
                        className="w-64 flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                      {isLoading ? (
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
                        <FiLock className="mr-2" />
                      )}
                      {isLoading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setStep(1)}
                        className="w-64 flex justify-center cursor-pointer py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                      >
                      <FiArrowLeft className="mr-2" />
                      Back to Email Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="text-sm text-center">
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center"
                  >
                    <FiArrowLeft className="mr-1" />
                    Return to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, -50px) scale(1.1);
            }
            50% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            75% {
              transform: translate(50px, 50px) scale(1.05);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
