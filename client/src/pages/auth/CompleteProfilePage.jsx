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

const CompleteProfilePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeGoogleProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    phone: '',
    state: ''
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.state) {
      setMessageType("error");
      setMessage("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await completeGoogleProfile(token, formData.phone, formData.state);
      if (result.success) {
        setMessageType("success");
        setMessage("Profile completed successfully! Redirecting...");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(result.message || "Failed to complete profile");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred. Please try again.");
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
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide additional information to complete your registration
        </p>
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
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Enter your phone number"
                />
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
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                >
                  <option value="">Select your state</option>
                  {STATES_OF_INDIA.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
  );
};

export default CompleteProfilePage;