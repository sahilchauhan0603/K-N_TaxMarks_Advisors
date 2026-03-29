import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiMail,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiLock,
  FiChevronDown,
} from "react-icons/fi";
import logo from "../../assets/logo.png";

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

const CompleteProfilePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeGoogleProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: "",
    state: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    state: "",
  });
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const normalizePhone = (value) => value.replace(/\D/g, "").slice(0, 10);

  const validatePhone = (value) => {
    const normalizedPhone = normalizePhone(value);
    if (!normalizedPhone) return "Phone number is required";
    if (normalizedPhone.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      return "Phone number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  const validateState = (value) => {
    if (!value) return "State is required";
    if (!STATES_OF_INDIA.includes(value)) return "Please select a valid state";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedPhone = normalizePhone(formData.phone);
    const phoneError = validatePhone(normalizedPhone);
    const stateError = validateState(formData.state);

    setFormData((prev) => ({
      ...prev,
      phone: normalizedPhone,
    }));
    setErrors({
      phone: phoneError,
      state: stateError,
    });

    if (phoneError || stateError) {
      setMessageType("error");
      setMessage("Please fix the errors below.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const result = await completeGoogleProfile(
        token,
        normalizedPhone,
        formData.state,
      );
      if (result.success) {
        setMessageType("success");
        setMessage("Profile completed successfully! Redirecting...");
        window.removeEventListener("beforeunload", handleBeforeUnload);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(result.message || "Failed to complete profile");
      }
    } catch {
      setMessageType("error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Warn user about data loss on refresh
  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = "Your data might be lost if you refresh";
    return "Your data might be lost if you refresh";
  }
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
              />
              {/* Profile completion */}
              <circle cx="200" cy="180" r="50" fill="white" fillOpacity="0.9" />
              <circle cx="200" cy="150" r="25" fill="#8B5CF6" />
              <path
                d="M150 220 Q150 180 200 180 Q250 180 250 220 L250 240 L150 240 Z"
                fill="white"
                fillOpacity="0.9"
              />
              {/* Progress indicator */}
              <circle
                cx="200"
                cy="200"
                r="80"
                stroke="white"
                strokeWidth="8"
                strokeOpacity="0.3"
                fill="none"
              />
              <circle
                cx="200"
                cy="200"
                r="80"
                stroke="#10B981"
                strokeWidth="8"
                fill="none"
                strokeDasharray="380"
                strokeDashoffset="95"
                transform="rotate(-90 200 200)"
              />
              {/* Checkmark */}
              <circle cx="280" cy="240" r="20" fill="#10B981" />
              <path
                d="M272 240 L278 246 L288 234"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2 drop-shadow-sm text-gray-800">
              Almost There!
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Complete your profile to unlock all features and start managing
              your tax filings with expert guidance.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-blue-200 shadow-sm">
              <div className="text-xs text-gray-600 mb-1 font-medium">
                75% Complete
              </div>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-12 xl:px-16 relative">
          {/* Back to Home Link */}
          <div className="absolute top-6 left-6">
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
              Complete Your Profile
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Just one more step to get started
            </p>

            {/* Trust Indicators */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiShield className="text-green-600" />
                <span>Secure</span>
              </div>
              <div className="h-3 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <FiLock className="text-blue-600" />
                <span>Private</span>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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

              <form className="space-y-5" onSubmit={handleSubmit}>
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
                      value={formData.name}
                      readOnly
                      className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 bg-gray-50 text-gray-500 sm:text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 bg-gray-50 text-gray-500 sm:text-sm"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        const digitsOnly = normalizePhone(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          phone: digitsOnly,
                        }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      onBlur={() => {
                        setErrors((prev) => ({
                          ...prev,
                          phone: validatePhone(formData.phone),
                        }));
                      }}
                      className={`appearance-none block w-full pl-10 pr-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, state: "" }));
                      }}
                      onBlur={() => {
                        setErrors((prev) => ({
                          ...prev,
                          state: validateState(formData.state),
                        }));
                      }}
                      className={`appearance-none cursor-pointer block w-full pl-10 pr-10 py-3 border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    >
                      <option value="">Select your state</option>
                      {STATES_OF_INDIA.map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                    {errors.state && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {errors.state}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-64 cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
                      <FiUser className="mr-2" />
                    )}
                    {isLoading ? "Completing Profile..." : "Complete Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <style jsx="true">{`
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

export default CompleteProfilePage;
