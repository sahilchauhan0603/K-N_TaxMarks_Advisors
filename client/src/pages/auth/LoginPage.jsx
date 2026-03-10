import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasFormData, setHasFormData] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 1000,
    yearsOfExperience: 10,
  });
  const { login } = useAuth();

  // Detect if this window is the OAuth popup callback (evaluated once, before first paint)
  const [isPopupCallback] = useState(
    () =>
      window.opener != null &&
      window.opener !== window &&
      (window.location.search.includes('code') ||
        window.location.search.includes('token') ||
        window.location.hash.includes('access_token')),
  );

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats/public");
        if (response.data.success && response.data.stats) {
          setStats({
            totalClients: response.data.stats.totalClients || 1000,
            yearsOfExperience: response.data.stats.yearsOfExperience || 10,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default fallback values if fetch fails
      }
    };
    fetchStats();
  }, []);

  // Detect OAuth popup callback and relay to parent window
  useEffect(() => {
    // If running inside the OAuth popup, relay authentication result and close
    if (window.opener && window.opener !== window) {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      if (success || error) {
        // Send result to parent window
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_RESULT',
            success: success === 'true',
            token: token,
            error: error,
          },
          window.location.origin,
        );
        // Close popup
        window.close();
        return;
      }
    }
  }, []);

  // Load saved email if "Remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Page reload warning effect
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData && !isRedirecting) {
        e.preventDefault();
        e.returnValue =
          "Your login details might get lost. Are you sure you want to reload?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasFormData, isRedirecting]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please fill all fields");
      setHasFormData(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setHasFormData(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setMessageType("success");
        setMessage("Login successful! Redirecting...");

        // Save or remove email based on "Remember me" checkbox
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }

        // Set redirecting flag to prevent beforeunload warning
        setIsRedirecting(true);
        setHasFormData(false);

        // Small delay to show success message
        setTimeout(() => {
          const params = new URLSearchParams(location.search);
          const redirectTo = params.get("redirectTo");
          const stateRedirect = location.state?.redirect;
          const shouldOpenForm = location.state?.openTestimonialForm;

          if (redirectTo) {
            navigate(redirectTo, { replace: true });
          } else if (stateRedirect) {
            // Pass along any additional state for the target page
            const navigationState = shouldOpenForm
              ? { openTestimonialForm: true }
              : {};
            navigate(stateRedirect, { replace: true, state: navigationState });
          } else {
            navigate("/", { replace: true });
          }
        }, 1000);
      } else {
        setMessageType("error");
        setMessage(result.message || "Login failed");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(
        "An error occurred. Please try again. Error: " + error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If running inside the OAuth popup, show a minimal loader while redirecting
  if (isPopupCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Completing sign-in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex overflow-hidden">
      {/* Left Side - Image/Illustration Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center px-8 py-6 text-gray-800 w-full">
          {/* Logo */}
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

          {/* Illustration - Tax/Finance SVG */}
          <div className="mb-4">
            <svg
              className="w-48 h-48"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Calculator/Document Illustration */}
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="#EEF2FF"
                fillOpacity="0.5"
              />
              <rect
                x="120"
                y="100"
                width="160"
                height="200"
                rx="10"
                fill="white"
                fillOpacity="0.9"
              />
              <rect
                x="140"
                y="120"
                width="120"
                height="30"
                rx="5"
                fill="#3B82F6"
              />
              <circle cx="150" cy="170" r="8" fill="#60A5FA" />
              <circle cx="180" cy="170" r="8" fill="#60A5FA" />
              <circle cx="210" cy="170" r="8" fill="#60A5FA" />
              <circle cx="240" cy="170" r="8" fill="#60A5FA" />
              <rect
                x="140"
                y="200"
                width="120"
                height="4"
                rx="2"
                fill="#E0E7FF"
              />
              <rect
                x="140"
                y="215"
                width="90"
                height="4"
                rx="2"
                fill="#E0E7FF"
              />
              <rect
                x="140"
                y="230"
                width="100"
                height="4"
                rx="2"
                fill="#E0E7FF"
              />
              <path
                d="M180 260 L200 280 L240 240"
                stroke="#10B981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2 drop-shadow-sm text-gray-800">
              Trusted Tax Solutions
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Access your account to manage filings, track submissions, and stay
              updated with the latest tax regulations.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-blue-200 shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                  {stats.yearsOfExperience}+
                </div>
                <div className="text-gray-600 text-[10px]">
                  Years Experience
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-blue-200 shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                  {stats.totalClients}+
                </div>
                <div className="text-gray-600 text-[10px]">Happy Clients</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Secure Platform</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12 xl:px-16 relative">
          {/* Back to Home Link */}
          <div className="absolute top-4 left-4">
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
            <Link to="/" className="flex justify-center mb-4 lg:hidden">
              <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <img
                  src={logo}
                  alt="K-N Taxmarks Advisors"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <h2 className="text-center text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Sign in to continue to your account
            </p>

            {/* Trust Indicators */}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiShield className="text-green-600" />
                <span>Secure Login</span>
              </div>
              <div className="h-3 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <FiLock className="text-blue-600" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-6 px-6 shadow-xl rounded-2xl sm:px-8 border border-gray-100">
              {message && (
                <div
                  className={`mb-3 p-3 rounded-lg flex items-start gap-3 ${
                    messageType === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}
                >
                  {messageType === "error" ? (
                    <FiAlertCircle className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiCheckCircle className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
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
                        if (e.target.value.trim() || password.trim()) {
                          setHasFormData(true);
                        } else {
                          setHasFormData(false);
                        }
                      }}
                      className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                      placeholder="Enter your email"
                    />
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.trim() || email.trim()) {
                          setHasFormData(true);
                        } else {
                          setHasFormData(false);
                        }
                      }}
                      className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-64 flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
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
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>

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
                    onClick={() => {
                      const googleAuthUrl =
                        import.meta.env.VITE_GOOGLE_AUTH_URL ||
                        "http://localhost:5000/api/auth/google";
                      const width = 500;
                      const height = 600;
                      const left = window.screen.width / 2 - width / 2;
                      const top = window.screen.height / 2 - height / 2;
                      
                      const popup = window.open(
                        googleAuthUrl,
                        "Google Sign In",
                        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
                      );

                      if (!popup) {
                        alert('Popup blocked. Please allow popups for this site.');
                        return;
                      }

                      // Listen for message from popup
                      const handleMessage = (event) => {
                        if (event.origin !== window.location.origin) return;
                        if (event.data?.type !== 'GOOGLE_AUTH_RESULT') return;

                        window.removeEventListener('message', handleMessage);

                        if (event.data.success && event.data.token) {
                          // Store token and redirect
                          localStorage.setItem('token', event.data.token);
                          setMessage('Login successful! Redirecting...');
                          setMessageType('success');
                          setTimeout(() => {
                            navigate('/', { replace: true });
                          }, 1000);
                        } else {
                          setMessage(event.data.error || 'Google sign-in failed');
                          setMessageType('error');
                        }
                      };

                      window.addEventListener('message', handleMessage);

                      // Clean up if popup is closed without completing auth
                      const checkClosed = setInterval(() => {
                        if (popup.closed) {
                          clearInterval(checkClosed);
                          window.removeEventListener('message', handleMessage);
                        }
                      }, 500);
                    }}
                    className="w-64 cursor-pointer inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>
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
  );
};

export default LoginPage;
