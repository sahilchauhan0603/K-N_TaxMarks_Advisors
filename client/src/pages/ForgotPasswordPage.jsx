import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { FiMail, FiLock } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/forgot-password', { email });
      if (res.data.success) {
        setStep(2);
        setMessage('OTP sent to your email. Check your inbox.');
      } else {
        setMessage(res.data.message || 'Error sending OTP');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again...' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setMessage('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/reset-password', { email, otp, newPassword });
      if (res.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(res.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again...' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg">
            <FiLock className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-blue-900">
          Forgot Password
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-blue-100">
          {message && (
            <div
              className={`mb-4 p-3 rounded-md border flex items-center gap-2 ${
                message.toLowerCase().includes('otp sent') || message.toLowerCase().includes('success')
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <FiLock className={
                message.toLowerCase().includes('otp sent') || message.toLowerCase().includes('success')
                  ? 'text-green-400 text-lg'
                  : 'text-red-400 text-lg'
              } />
              {message}
            </div>
          )}
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <FiMail className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                >
                  <FiLock className="text-lg" />
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-blue-700">
                  OTP (Check your email)
                </label>
                <div className="mt-1 relative">
                  <FiLock className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-blue-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <FiLock className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <FiLock className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                >
                  <FiLock className="text-lg" />
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
