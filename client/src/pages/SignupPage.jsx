import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

const STATES_OF_INDIA = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const { sendOTP, register } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await sendOTP(email);
      if (result.success) {
        setStep(2);
        setMessage('OTP sent to your email. Check your inbox.');
      } else {
        setMessage(result.message || 'Error sending OTP');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again...Error is ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !state || !otp || !password || !confirmPassword) {
      setMessage('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await register(name, email, otp, password, phone, state);
      if (result.success) {
        navigate('/');
      } else {
        setMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again...Error is ' + error.message);
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
          Create your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-blue-100">
          {message && (
            <div
              className={`mb-4 p-3 rounded-md border flex items-center gap-2 ${{
                green: message.toLowerCase().includes('otp sent') || message.toLowerCase().includes('success'),
                red: !message.toLowerCase().includes('otp sent') && !message.toLowerCase().includes('success'),
              }.green ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}
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
                <label htmlFor="name" className="block text-sm font-medium text-blue-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <FiUser className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-blue-700">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <FiPhone className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
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
                <label htmlFor="state" className="block text-sm font-medium text-blue-700">
                  State
                </label>
                <div className="mt-1">
                  <select
                    id="state"
                    name="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
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
                <label htmlFor="password" className="block text-sm font-medium text-blue-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <FiLock className="absolute left-3 top-3 text-blue-400 text-lg" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-blue-50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to email
                </button>
              </div>
              <div>
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                >
                  <FiLock className="text-lg" />
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;