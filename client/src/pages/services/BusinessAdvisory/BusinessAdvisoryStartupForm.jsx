import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../utils/axios';

const BusinessAdvisoryStartupForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    notes: '',
    documents: null,
  });
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setFileName(files[0]?.name || '');
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const res = await axios.post('/api/business-startup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccess('Your Startup & MSME Registration request has been submitted successfully!');
        setForm((prev) => ({ ...prev, businessName: '', businessType: '', notes: '', documents: null }));
        window.removeEventListener('beforeunload', handleBeforeUnload);
      } else {
        setError(res.data.message || 'Submission failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again..' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Warn user about data loss on refresh
  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = 'Your data might be lost if you refresh';
    return 'Your data might be lost if you refresh';
  }
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gradient-to-br from-pink-50 to-white border-l-4 border-pink-500 rounded-xl p-6 shadow-md">
      <h4 className="text-lg font-bold text-pink-700 mb-4">Startup & MSME Registration</h4>
      {success && <div className="mb-3 p-2 bg-pink-100 text-pink-800 rounded">{success}</div>}
      {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-pink-700 mb-1">Business Name</label>
          <input name="businessName" value={form.businessName} onChange={handleChange} className="w-full border border-pink-200 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" />
        </div>
        <div>
          <label className="block text-sm text-pink-700 mb-1">Business Type</label>
          <select name="businessType" value={form.businessType} onChange={handleChange} className="w-full border border-pink-200 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400">
            <option value="">Select Type</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="Private Limited">Private Limited</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-pink-700 mb-1 font-semibold">Upload Images (JPG/PNG/GIF/WEBP)</label>
        <div className="flex items-center gap-3">
          <label className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-2 px-4 rounded-lg cursor-pointer border border-pink-300 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-pink-700">
            Choose File
            <input
              name="documents"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600 truncate max-w-xs">{fileName || 'No file chosen'}</span>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-pink-700 mb-1">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-pink-200 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" />
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded shadow cursor-pointer transition disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default BusinessAdvisoryStartupForm;
