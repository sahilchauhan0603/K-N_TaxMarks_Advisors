import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../utils/axios';
import { useServicePrice } from '../../../utils/servicePricing';
import Swal from 'sweetalert2';

const TrademarkDocumentationForm = ({ onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    documentType: '',
    notes: '',
    documents: null,
  });
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get pricing information
  const { price, loading: priceLoading, formattedPrice } = useServicePrice('trademark', 'documentation');

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
      const res = await axios.post('/api/trademark-documentation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setForm((prev) => ({ ...prev, documentType: '', notes: '', documents: null }));
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Show SweetAlert success message
        Swal.fire({
          title: '🎉 Success!',
          html: `
            <div class="text-center space-y-3">
              <div class="text-4xl mb-3">✅</div>
              <p class="text-lg text-gray-700 font-medium">Your Legal Documentation & Compliance request has been submitted successfully!</p>
              <p class="text-sm text-blue-600 font-semibold">📋 Track your service request in your profile page</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#8B5CF6',
          confirmButtonText: '👍 Got it!',
          timer: 5000,
          timerProgressBar: true
        }).then(() => {
          if (onClose) {
            onClose();
          }
        });
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
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-white">
      {/* Header Section - Fixed Height */}
      <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h4 className="text-xl sm:text-2xl font-bold">Legal Documentation & Compliance</h4>
          <div className="bg-purple-500/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-purple-400/30">
            <span className="text-sm text-purple-100 font-medium">Service Fee: </span>
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
          {/* Document Type Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-purple-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <input 
              name="documentType" 
              value={form.documentType} 
              onChange={handleChange} 
              required
              className="w-full border border-purple-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="e.g., Trademark Application, License Agreement, IP Policy"
            />
          </div>

          {/* File Upload Section - Images Only */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-700">
              Upload Documents (Images Only)
            </label>
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg cursor-pointer border border-purple-300 transition-colors">
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
            <label className="block text-sm font-semibold text-purple-700">
              Additional Notes
            </label>
            <textarea 
              name="notes" 
              value={form.notes} 
              onChange={handleChange} 
              rows={3}
              className="w-full border border-purple-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
              placeholder="Specify your legal documentation requirements, compliance needs, etc..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Request...
                </div>
              ) : (
                'Submit Documentation Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrademarkDocumentationForm;
