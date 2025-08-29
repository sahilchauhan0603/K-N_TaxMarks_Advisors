
import React, { useState } from 'react';
import axios from '../../../utils/axios';
import { FaUserShield, FaEnvelope, FaKey, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const allowedEmails = [
  'sahilchauhan0603@gmail.com',
  'sahilpersonal2003@gmail.com',
  'saritachauhan0704@gmail.com',
];

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!allowedEmails.includes(email)) {
      setError('not-allowed');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/admin/send-otp', { email });
      setStep(2);
      setError('');
      setInfo('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/verify-otp', { email, otp });
      localStorage.setItem('adminToken', res.data.token);
      window.location.href = '/admin';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <FaUserShield className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="mt-1.5 text-center text-3xl font-bold text-gray-900">Admin Login</h2>
        <p className="mt-1.5 text-center text-sm text-gray-600">Sign in to access the admin panel</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {error === 'not-allowed' && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 border border-red-200">
              <FaLock className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <span>This user is not allowed to access the admin panel.</span>
              <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setError('')} title="Close">&times;</button>
            </div>
          )}
          {info && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-green-50 text-green-800 border border-green-200">
              <FaKey className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
              <span>{info}</span>
            </div>
          )}
          {error && error !== 'not-allowed' && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 border border-red-200">
              <FaLock className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
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
                    onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Enter admin email"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="admin-otp"
                    name="admin-otp"
                    type="text"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 tracking-widest"
                    placeholder="Enter OTP"
                    autoFocus
                    maxLength={6}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
                  {loading ? 'Verifying...' : 'Login'}
                </button>
              </div>
            </form>
          )}
          <div className="mt-8 text-xs text-slate-400 text-center">
            Only authorized admin emails can access this panel.<br />
            For security, OTP is valid for 5 minutes.
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

export default AdminLogin;
