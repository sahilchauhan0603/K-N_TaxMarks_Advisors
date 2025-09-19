import React, { useState } from 'react';
// import { useAuth } from '/src/context/AuthContext';
import { useAuth } from '../../../context/AuthContext';
// import axios from '../utils/axios';
import axios from '../../../utils/axios'; // Adjust the import path as necessary

const ITRFilingForm = ({ type = 'individual' }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    pan: '',
    itrType: type === 'business' ? 'Business' : 'Individual',
    annualIncome: '',
    notes: '',
    documents: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
      const res = await axios.post('/api/itr-filing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccess('Your ITR request has been submitted successfully!');
        setForm((prev) => ({ ...prev, pan: '', annualIncome: '', notes: '', documents: null }));
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
    <form onSubmit={handleSubmit} className="mt-6 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500 rounded-xl p-6 shadow-md">
      <h4 className="text-lg font-bold text-green-700 mb-4">ITR Filing Request</h4>
      {success && <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{success}</div>}
      {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-green-700 mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-sm text-green-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-sm text-green-700 mb-1">Mobile</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-sm text-green-700 mb-1">PAN</label>
          <input name="pan" value={form.pan} onChange={handleChange} required className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 uppercase" />
        </div>
        <div>
          <label className="block text-sm text-green-700 mb-1">Type</label>
          <select name="itrType" value={form.itrType} onChange={handleChange} className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400">
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-green-700 mb-1">Annual Income (₹)</label>
          <input name="annualIncome" value={form.annualIncome} onChange={handleChange} required className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-green-700 mb-1">Upload Documents (PDF/JPG/PNG)</label>
        <input name="documents" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="w-full border border-green-200 rounded px-3 py-2" />
      </div>
      <div className="mt-4">
        <label className="block text-sm text-green-700 mb-1">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-green-200 rounded px-3 py-2 focus:ring-2 focus:ring-green-400" />
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow cursor-pointer transition disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default ITRFilingForm;
