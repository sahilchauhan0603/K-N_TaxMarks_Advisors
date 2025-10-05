import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

const SERVICE_OPTIONS = [
  'Trademark',
  'Business Advisory',
  'GST Filing',
  'ITR Filing',
  'Tax Planning',
];

const UserTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMyTestimonials();
  }, []);

  const fetchMyTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/testimonials/my');
      setTestimonials(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await axios.delete(`/api/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending Review
      </span>
    );
  };

  const handleFormSuccess = () => {
    fetchMyTestimonials(); // Refresh the testimonials list
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-full">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Testimonials</h1>
              <p className="text-gray-600">Manage your submitted testimonials and their approval status.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Submit New Testimonial</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {testimonials.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-500 mb-6">You haven't submitted any testimonials yet. Share your experience with our services!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Submit Your First Testimonial</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      {testimonial.photoUrl && (
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                        <p className="text-sm text-gray-500">Service: {testimonial.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(testimonial.isApproved)}
                      <button
                        onClick={() => deleteTestimonial(testimonial._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete testimonial"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Submitted on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showForm && (
          <TestimonialForm
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

const TestimonialForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    role: user?.role || '',
    photoUrl: user?.photoUrl || '',
    service: '',
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
      
      // Use authenticated endpoint since user is logged in
      const response = await axios.post('/api/testimonials', formData, config);
      
      setSuccess(true);
      setError('');
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
      
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
    <div className="fixed inset-0 backdrop-blur-lg bg-black/50 flex items-center justify-center z-50">
      <form
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-200 animate-fadeIn"
        onSubmit={handleSubmit}
        style={{ minHeight: '480px' }}
      >
        <button
          type="button"
          className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-black text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-extrabold mb-2 text-gray-800 text-center tracking-tight">Share Your Experience</h3>
        <p className="text-xs text-gray-400 mb-4 text-center">We value your feedback!</p>
        
        <div className="mb-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-300"
            placeholder="Your Name"
            required
          />
        </div>
        
        <div className="mb-2">
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-500"
            placeholder="Your Designation"
            required
          />
        </div>
        
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-gray-700 text-sm">Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <div className="mb-2">
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full cursor-pointer border border-gray-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white text-gray-800"
            required
          >
            <option value="">Select Service</option>
            {SERVICE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-2">
          <textarea
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm focus:outline-none bg-white placeholder-gray-500 resize-none"
            rows={3}
            maxLength={250}
            placeholder="Your feedback (max 250 chars)"
            required
          />
          <div className="text-xs text-gray-400 text-right mt-1">
            {form.feedback.length}/250 characters
          </div>
        </div>
        
        {error && <p className="text-red-500 mb-2 text-center text-xs">{error}</p>}
        {success && <p className="text-green-600 mb-2 text-center text-xs">Thank you for your feedback!</p>}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold py-2 px-4 rounded-lg shadow transition text-sm mt-1"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </form>
    </div>
  );
};

export default UserTestimonials;