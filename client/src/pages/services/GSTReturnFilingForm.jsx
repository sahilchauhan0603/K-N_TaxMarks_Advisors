import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';

const GSTReturnFilingForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    gstin: '',
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
      const res = await axios.post('/api/gst-return-filing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.message) {
        setSuccess('Your GST Return Filing request has been submitted successfully!');
        setForm((prev) => ({ ...prev, gstin: '', notes: '', documents: null }));
      } else {
        setError(res.data.error || 'Submission failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500 rounded-xl p-6 shadow-md">
      <h4 className="text-lg font-bold text-yellow-700 mb-4">GST Return Filing</h4>
      {success && <div className="mb-3 p-2 bg-yellow-100 text-yellow-800 rounded">{success}</div>}
      {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-yellow-700 mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-yellow-200 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="block text-sm text-yellow-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-yellow-200 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="block text-sm text-yellow-700 mb-1">Mobile</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border border-yellow-200 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="block text-sm text-yellow-700 mb-1">GSTIN</label>
          <input name="gstin" value={form.gstin} onChange={handleChange} required className="w-full border border-yellow-200 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400 uppercase" />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-yellow-700 mb-1">Upload Documents (PDF/JPG/PNG)</label>
        <input name="documents" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="w-full border border-yellow-200 rounded px-3 py-2" />
      </div>
      <div className="mt-4">
        <label className="block text-sm text-yellow-700 mb-1">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-yellow-200 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400" />
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default GSTReturnFilingForm;
