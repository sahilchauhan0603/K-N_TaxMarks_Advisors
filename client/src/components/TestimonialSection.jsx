import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FaQuoteLeft, FaStar, FaUser, FaHeart, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const SERVICE_OPTIONS = [
  'Trademark',
  'Business Advisory',
  'GST Filing',
  'ITR Filing',
  'Tax Planning',
  // Add more as needed
];

// Color map for each service
const SERVICE_COLORS = {
  'Trademark': {
    primary: 'purple',
    bg: 'bg-white',
    border: 'border-purple-500',
    text: 'text-purple-700',
    button: 'bg-purple-700 hover:bg-purple-800',
  },
  'Business Advisory': {
    primary: 'pink',
    bg: 'bg-white',
    border: 'border-pink-500',
    text: 'text-pink-700',
    button: 'bg-pink-700 hover:bg-pink-800',
  },
  'GST Filing': {
    primary: 'yellow',
    bg: 'bg-white',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    button: 'bg-yellow-700 hover:bg-yellow-800',
  },
  'ITR Filing': {
    primary: 'green',
    bg: 'bg-white',
    border: 'border-green-500',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
  },
  'Tax Planning': {
    primary: 'blue',
    bg: 'bg-white',
    border: 'border-blue-500',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
};

const TestimonialSection = ({ service }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const colors = SERVICE_COLORS[service] || SERVICE_COLORS['Business Advisory'];

  // Limit testimonials to 4 initially
  const INITIAL_DISPLAY_COUNT = 4;
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreTestimonials = testimonials.length > INITIAL_DISPLAY_COUNT;

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`/api/testimonials?service=${service}`);
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line
  }, [service]);

  return (
    <div className="mt-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div 
        className="text-white p-8"
        style={{
          background: `linear-gradient(to right, 
            ${colors.primary === 'purple' ? '#7C3AED' : 
              colors.primary === 'pink' ? '#EC4899' : 
              colors.primary === 'yellow' ? '#EAB308' : 
              colors.primary === 'green' ? '#10B981' : 
              colors.primary === 'blue' ? '#3B82F6' : '#7C3AED'}, 
            ${colors.primary === 'purple' ? '#5B21B6' : 
              colors.primary === 'pink' ? '#DB2777' : 
              colors.primary === 'yellow' ? '#D97706' : 
              colors.primary === 'green' ? '#059669' : 
              colors.primary === 'blue' ? '#2563EB' : '#5B21B6'})`
        }}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <FaQuoteLeft className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-lg opacity-90 mb-6">Real experiences from real people</p>
          <button
            className="inline-flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 font-semibold cursor-pointer py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowForm(true)}
          >
            <FaEdit className="w-4 h-4" />
            Share Your Experience
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="p-8">
        {testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FaHeart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials yet</h3>
            <p className="text-gray-500">Be the first to share your experience with our {service} services!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedTestimonials.map((t, idx) => (
                <div 
                  key={t._id || idx} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Quote Icon */}
                  <div 
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-4"
                    style={{
                      backgroundColor: colors.primary === 'purple' ? '#F3E8FF' : 
                                     colors.primary === 'pink' ? '#FCE7F3' : 
                                     colors.primary === 'yellow' ? '#FEF3C7' : 
                                     colors.primary === 'green' ? '#D1FAE5' : 
                                     colors.primary === 'blue' ? '#DBEAFE' : '#F3E8FF'
                    }}
                  >
                    <FaQuoteLeft 
                      className="w-5 h-5"
                      style={{
                        color: colors.primary === 'purple' ? '#7C3AED' : 
                               colors.primary === 'pink' ? '#EC4899' : 
                               colors.primary === 'yellow' ? '#EAB308' : 
                               colors.primary === 'green' ? '#10B981' : 
                               colors.primary === 'blue' ? '#3B82F6' : '#7C3AED'
                      }}
                    />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{t.feedback}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={t.photoUrl || `https://randomuser.me/api/portraits/lego/${idx % 10}.jpg`}
                          alt="Client"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=${colors.primary.substring(0,3)}&color=fff&size=48`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1">
                          <MdVerified className="w-5 h-5 text-blue-500 bg-white rounded-full" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                    
                    {/* Service Badge */}
                    <div 
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: colors.primary === 'purple' ? '#F3E8FF' : 
                                       colors.primary === 'pink' ? '#FCE7F3' : 
                                       colors.primary === 'yellow' ? '#FEF3C7' : 
                                       colors.primary === 'green' ? '#D1FAE5' : 
                                       colors.primary === 'blue' ? '#DBEAFE' : '#F3E8FF',
                        color: colors.primary === 'purple' ? '#5B21B6' : 
                               colors.primary === 'pink' ? '#BE185D' : 
                               colors.primary === 'yellow' ? '#B45309' : 
                               colors.primary === 'green' ? '#047857' : 
                               colors.primary === 'blue' ? '#1D4ED8' : '#5B21B6'
                      }}
                    >
                      {t.service}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show More/Show Less Buttons */}
            {hasMoreTestimonials && (
              <div className="text-center mt-8">
                {!showAll ? (
                  <button
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-white"
                    style={{
                      background: `linear-gradient(to right, 
                        ${colors.primary === 'purple' ? '#7C3AED' : 
                          colors.primary === 'pink' ? '#EC4899' : 
                          colors.primary === 'yellow' ? '#EAB308' : 
                          colors.primary === 'green' ? '#10B981' : 
                          colors.primary === 'blue' ? '#3B82F6' : '#7C3AED'}, 
                        ${colors.primary === 'purple' ? '#5B21B6' : 
                          colors.primary === 'pink' ? '#DB2777' : 
                          colors.primary === 'yellow' ? '#D97706' : 
                          colors.primary === 'green' ? '#059669' : 
                          colors.primary === 'blue' ? '#2563EB' : '#5B21B6'})`
                    }}
                  >
                    <span>Show More Testimonials</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      +{testimonials.length - INITIAL_DISPLAY_COUNT}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAll(false)}
                    className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Show Less</span>
                    <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {showForm && (
        <TestimonialForm
          service={service}
          onClose={() => setShowForm(false)}
          onSuccess={fetchTestimonials}
          color={colors}
        />
      )}
    </div>
  );
};

const TestimonialForm = ({ service, onClose, onSuccess, color }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    role: user?.role || '',
    photoUrl: user?.photoUrl || '',
    service: service || '',
    feedback: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('role', form.role);
      formData.append('service', form.service);
      formData.append('feedback', form.feedback);
      if (imageFile) {
        formData.append('photo', imageFile);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      // Use appropriate endpoint based on authentication status
      const endpoint = user ? '/api/testimonials' : '/api/testimonials/public';
      
      const response = await axios.post(endpoint, formData, config);
      
      setSuccess(true);
      setError(''); // Clear any previous errors
      
      // Show success message with appropriate text
      const successMessage = user 
        ? 'Testimonial submitted successfully!' 
        : 'Thank you! Your testimonial has been submitted and will be reviewed before being published.';
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
      }, 2000); // Increased timeout to show the message longer
      
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        role: user.role || '',
        photoUrl: user.photoUrl || '',
      }));
    }
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[90vh] max-h-[600px] relative overflow-hidden animate-fadeIn border border-gray-200 flex flex-col">
        {/* Header - Fixed */}
        <div 
          className="text-white p-2 text-center relative flex-shrink-0"
          style={{
            background: `linear-gradient(to right, 
              ${color?.primary === 'purple' ? '#7C3AED' : 
                color?.primary === 'pink' ? '#EC4899' : 
                color?.primary === 'yellow' ? '#EAB308' : 
                color?.primary === 'green' ? '#10B981' : 
                color?.primary === 'blue' ? '#3B82F6' : '#7C3AED'}, 
              ${color?.primary === 'purple' ? '#5B21B6' : 
                color?.primary === 'pink' ? '#DB2777' : 
                color?.primary === 'yellow' ? '#D97706' : 
                color?.primary === 'green' ? '#059669' : 
                color?.primary === 'blue' ? '#2563EB' : '#5B21B6'})`
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl focus:outline-none transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3">
            <FaHeart className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Share Your Experience</h3>
          <p className="text-sm opacity-90">Help others discover our services!</p>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline w-4 h-4 mr-2" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Role Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Role/Designation
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              placeholder="e.g., Business Owner, CEO, etc."
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full cursor-pointer border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Experience
            </label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-gray-50 focus:bg-white cursor-pointer"
              required
            >
              <option value="">Select the service you used</option>
              {SERVICE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
              rows={4}
              maxLength={300}
              placeholder="Share your experience with our services..."
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {form.feedback.length}/300 characters
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
              <div className="flex items-center">
                <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <p className="text-green-700 text-sm">Thank you for your valuable feedback!</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: `linear-gradient(to right, 
                ${color?.primary === 'purple' ? '#7C3AED' : 
                  color?.primary === 'pink' ? '#EC4899' : 
                  color?.primary === 'yellow' ? '#EAB308' : 
                  color?.primary === 'green' ? '#10B981' : 
                  color?.primary === 'blue' ? '#3B82F6' : '#3B82F6'}, 
                ${color?.primary === 'purple' ? '#5B21B6' : 
                  color?.primary === 'pink' ? '#DB2777' : 
                  color?.primary === 'yellow' ? '#D97706' : 
                  color?.primary === 'green' ? '#059669' : 
                  color?.primary === 'blue' ? '#2563EB' : '#2563EB'})`
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaHeart className="w-4 h-4 mr-2" />
                Submit Feedback
              </div>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
