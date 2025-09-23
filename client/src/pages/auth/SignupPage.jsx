import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NumericOTPInput from "../../components/NumericOTPInput";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiAlertCircle,
  FiCheckCircle,
  FiKey,
  FiMapPin,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

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

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'error' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Error states for each field
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    phone: "",
    otp: "",
    state: "",
    password: "",
    confirmPassword: ""
  });
  const [state, setState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const { sendOTP, register } = useAuth();
  const navigate = useNavigate();

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

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email address";
    return "";
  };

  const validateName = (value) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name is too short";
    return "";
  };

  const validatePhone = (value) => {
    if (!value) return "Phone number is required";
    if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
    return "";
  };

  const validateOTP = (value) => {
    if (!value) return "OTP is required";
    if (!/^\d{6}$/.test(value)) return "OTP must be 6 digits";
    return "";
  };

  const validateState = (value) => {
    if (!value) return "State is required";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    // Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
    if (!/\d/.test(value)) return "Password must contain a digit";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) return "Password must contain a special character";
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const handleSendOTP = async () => {
    const emailError = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: emailError }));
    if (emailError) {
      setMessageType("error");
      setMessage(emailError);
      return;
    }
    setIsLoading(true);
    setMessage("");

    try {
      const result = await sendOTP(email);
      if (result?.success) {
        setStep(2);
        setMessageType("success");
        setMessage("OTP sent to your email. Check your inbox.");
        // Start 10-minute timer (600 seconds)
        setOtpTimer(600);
        setCanResendOtp(false);
      } else {
        setMessageType("error");
        // Show a specific message if the backend says user already exists
        if (result?.message && result.message.toLowerCase().includes("user with this email already exists")) {
          setMessage("User with this email already exists");
        } else {
          setMessage(result?.message || "Error sending OTP");
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      setMessageType("error");
      setMessage("An error occurred. Please try again...Error is " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResendOtp) return;

    setIsLoading(true);
    setMessage("");

    try {
      const result = await sendOTP(email);
      if (result?.success) {
        setMessageType("success");
        setMessage("New OTP sent to your email. Check your inbox.");
        // Restart 10-minute timer
        setOtpTimer(600);
        setCanResendOtp(false);
        setOtp(""); // Clear previous OTP
      } else {
        setMessageType("error");
        setMessage(result?.message || "Error sending OTP");
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      setMessageType("error");
      setMessage("An error occurred. Please try again...Error is " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const stateError = validateState(state);
    const otpError = validateOTP(otp);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);
    const newErrors = {
      name: nameError,
      phone: phoneError,
      state: stateError,
      otp: otpError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      email: "" // Email is already validated in step 1
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) {
      setMessageType("error");
      setMessage("Please fix the errors below.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await register(name, email, otp, password, phone, state);
      if (result?.success) {
        navigate("/", { replace: true });
      } else {
        setMessageType("error");
        // Show a specific message if the backend says user already exists
        if (result?.message && result.message.toLowerCase().includes("user already exists")) {
          setMessage("User with this email already exists");
        } else {
          setMessage(result?.message || "Registration failed");
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      setMessageType("error");
      setMessage("An error occurred. Please try again...Error is " + err);
    } finally {
      setIsLoading(false);
    }
  };

  // Warn user about data loss on refresh only on step 2 (profile completion)
  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = 'Your data might be lost if you refresh';
      return 'Your data might be lost if you refresh';
    }
    if (step === 2) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="absolute top-3 left-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <FiUser className="text-white text-3xl" />
          </div>
        </div> */}
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join us and start your journey!
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full ml-4 mr-4 sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {message && (
            <div
              role="alert"
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <FiKey className="mr-2" />
                  )}
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        import.meta.env.VITE_GOOGLE_AUTH_URL ||
                        "http://localhost:5000/api/auth/google")
                    }
                    className="w-[150px] max-w-xs cursor-pointer inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.94 0 7.47 1.35 10.26 3.98l7.64-7.64C37.61 1.67 31.27-1 24  -1 14.59-1 6.47 4.99 2.69 13.27l8.9 6.9C13.05 14.05 18.12 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.75c-.55 2.9-2.25 5.37-4.8 7.04l7.45 5.8c4.35-4.01 6.85-9.92 6.85-17.09z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M11.59 28.17a14.48 14.48 0 01-.76-4.17c0-1.45.27-2.84.76-4.17l-8.9-6.9C1.6 16.3 0 20 0 24c0 4 1.6 7.7 4.19 10.07l8.9-6.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.9-2.13 15.87-5.79l-7.45-5.8c-2.08 1.4-4.74 2.22-8.42 2.22-5.88 0-10.95-4.55-12.41-10.63l-8.9 6.9C6.47 43.01 14.59 49 24 49z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Show Email (Read-only) */}
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="Full Name"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.name}</span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="Phone Number"
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP (Check your email)
                  </label>
                  {otpTimer > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      Expires in: {formatTimer(otpTimer)}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <NumericOTPInput
                    length={6}
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      setErrors((prev) => ({ ...prev, otp: "" }));
                    }}
                    disabled={isLoading}
                    autoFocus={false}
                  />
                  {errors.otp && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.otp}</span>
                  )}
                </div>

                {/* Resend OTP Button */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Didn't receive the code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResendOtp || isLoading}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      canResendOtp && !isLoading
                        ? "text-blue-600 hover:text-blue-500 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Sending..." : "Resend OTP"}
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

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="state"
                    name="state"
                    required
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setErrors((prev) => ({ ...prev, state: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-4 py-3 border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                  >
                    <option value="">Select your state</option>
                    {STATES_OF_INDIA.map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.state}</span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  {errors.password && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.password}</span>
                  )}
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
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-600 mt-1 block">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpTimer(0);
                    setCanResendOtp(false);
                    setOtp("");
                    setMessage("");
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Remove beforeunload warning on successful register
                    window.removeEventListener('beforeunload', () => {});
                    handleRegister();
                  }}
                  disabled={isLoading}
                  className="flex-1 group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <FiLock className="mr-2" />
                  )}
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
