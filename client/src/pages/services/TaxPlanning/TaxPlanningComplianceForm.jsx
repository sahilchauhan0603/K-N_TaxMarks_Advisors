import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../utils/axios';
import { useServicePrice } from '../../../utils/servicePricing';
import Swal from 'sweetalert2';

const TaxPlanningComplianceForm = ({ onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    complianceType: '',
    query: '',
    notes: '',
    documents: null,
  });
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get pricing information
  const { price, loading: priceLoading, formattedPrice } = useServicePrice('tax', 'compliance');

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
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Close the form after successful submission
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1500); // Wait 1.5 seconds to show success message before closing
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
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section - Fixed Height */}
      <div className="bg-blue-600 text-white p-4 sm:p-6 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h4 className="text-xl sm:text-2xl font-bold">Tax Compliance & Advisory</h4>
          <div className="bg-blue-500/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-400/30">
            <span className="text-sm text-blue-100 font-medium">Service Fee: </span>
            <span className="text-lg font-bold text-white">
              {priceLoading ? '...' : formattedPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="p-4 sm:p-6 space-y-4 h-[calc(450px-100px)] overflow-y-auto">
        {/* Status Messages */}
        {success && (
          <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-700">
                Compliance Type <span className="text-red-500">*</span>
              </label>
              <input 
                name="complianceType" 
                value={form.complianceType} 
                onChange={handleChange} 
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="e.g., TDS, GST, Income Tax"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-700">
                Your Query <span className="text-red-500">*</span>
              </label>
              <input 
                name="query" 
                value={form.query} 
                onChange={handleChange} 
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Describe your tax query"
              />
            </div>
          </div>

          {/* File Upload Section - Images Only */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-700">
              Upload Supporting Documents (Images Only)
            </label>
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg cursor-pointer border border-blue-300 transition-colors">
                  Choose Images
                  <input
                    name="documents"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {fileName || 'No file chosen'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Images only: JPG, PNG, GIF, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-700">
              Additional Details
            </label>
            <textarea 
              name="notes" 
              value={form.notes} 
              onChange={handleChange} 
              rows={3}
              className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
              placeholder="Provide additional details about your tax compliance requirements, deadlines, specific issues..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Request...
                </div>
              ) : (
                'Submit Compliance Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaxPlanningComplianceForm;
