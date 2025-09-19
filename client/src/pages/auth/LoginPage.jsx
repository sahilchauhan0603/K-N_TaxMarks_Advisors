import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(email, password);
      if (result.success) {
        setMessageType("success");
        setMessage("Login successful! Redirecting...");

        // Small delay to show success message
        setTimeout(() => {
          const params = new URLSearchParams(location.search);
          const redirectTo = params.get("redirectTo");
          if (redirectTo) {
            navigate(redirectTo, { replace: true });
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
        "An error occurred. Please try again. Error: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <FiLock className="text-white text-3xl" />
          </div>
        </div> */}
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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

          <form className="space-y-5" onSubmit={handleLogin}>
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
  );
};

export default LoginPage;
