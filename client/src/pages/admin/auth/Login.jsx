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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-sky-700 to-sky-400">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative">
        {/* Not allowed alert */}
        {error === 'not-allowed' && (
          <div className="absolute top-2 right-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded flex items-center gap-2 animate-fade-in">
            <span className="font-bold text-lg">&#10006;</span>
            <span>This user is not allowed to access the admin panel.</span>
            <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => setError('')} title="Close">&times;</button>
          </div>
        )}
        <div className="bg-sky-600 rounded-full p-4 mb-4 text-white text-3xl"><FaUserShield /></div>
        <h2 className="text-2xl font-bold mb-6 text-sky-800">Admin Login</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-sky-400 text-lg" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-900"
                placeholder="Enter admin email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              <FaLock /> {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <FaKey className="absolute left-3 top-3 text-sky-400 text-lg" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-900 tracking-widest"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                autoFocus
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              <FaUserShield /> {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        )}
        {info && <div className="mt-4 text-green-600 text-center text-sm">{info}</div>}
        {error && error !== 'not-allowed' && <div className="mt-4 text-red-600 text-center text-sm">{error}</div>}
        <div className="mt-8 text-xs text-slate-400 text-center">
          Only authorized admin emails can access this panel.<br />
          For security, OTP is valid for 5 minutes.
        </div>
        <div className="w-full flex justify-center mt-4">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-sky-800 font-semibold px-4 py-2 rounded-lg shadow hover:from-gray-400 hover:to-gray-500 transition-all duration-200 border-2 border-gray-300 hover:border-gray-500"
          >
            Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
