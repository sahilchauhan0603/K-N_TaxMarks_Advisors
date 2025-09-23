import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../utils/axios';

const TaxPlanningComplianceForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    complianceType: '',
    query: '',
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
      const res = await axios.post('/api/tax-compliance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccess('Your Tax Compliance & Advisory request has been submitted successfully!');
        setForm((prev) => ({ ...prev, complianceType: '', query: '', notes: '', documents: null }));
      } else {
        setError(res.data.message || 'Submission failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again..' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500 rounded-xl p-6 shadow-md">
      <h4 className="text-lg font-bold text-blue-700 mb-4">Tax Compliance & Advisory</h4>
      {success && <div className="mb-3 p-2 bg-blue-100 text-blue-800 rounded">{success}</div>}
      {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-700 mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm text-blue-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm text-blue-700 mb-1">Mobile</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm text-blue-700 mb-1">Compliance Type</label>
          <input name="complianceType" value={form.complianceType} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm text-blue-700 mb-1">Your Query</label>
          <input name="query" value={form.query} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-blue-700 mb-1 font-semibold">Upload Documents (PDF/JPG/PNG)</label>
        <div className="flex items-center gap-3">
          <label className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg cursor-pointer border border-blue-300 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700">
            Choose File
            <input
              name="documents"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600 truncate max-w-xs">{fileName || 'No file chosen'}</span>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-blue-700 mb-1">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow cursor-pointer transition disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default TaxPlanningComplianceForm;
