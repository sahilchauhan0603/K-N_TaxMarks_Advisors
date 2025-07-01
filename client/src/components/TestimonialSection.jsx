import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

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
  const colors = SERVICE_COLORS[service] || SERVICE_COLORS['Business Advisory'];

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
    <div className={`mt-16 ${colors.bg} rounded-xl shadow-md p-8`}>
      <h2 className={`text-3xl font-bold ${colors.text} mb-8 text-center`}>What Our Clients Say</h2>
      <button
        className={`mb-8 ${colors.button} text-white font-bold py-2 px-6 rounded-lg shadow transition`}
        onClick={() => setShowForm(true)}
      >
        Leave Feedback
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center">No testimonials yet. Be the first to leave feedback!</p>
        )}
        {testimonials.map((t, idx) => (
          <div key={t._id || idx} className={`border-l-4 ${colors.border} pl-4`}>
            <p className="text-gray-600 italic mb-4">"{t.feedback}"</p>
            <div className="flex items-center">
              <img
                src={t.photoUrl || `https://randomuser.me/api/portraits/lego/${idx % 10}.jpg`}
                alt="Client"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
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
      await axios.post('/api/testimonials', formData, config);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
      }, 1200);
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative border border-gray-200 animate-fadeIn`}
        onSubmit={handleSubmit}
        style={{ minHeight: 0 }}
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className={`text-xl font-extrabold mb-2 ${color?.text || 'text-gray-800'} text-center tracking-tight`}>Share Your Experience</h3>
        <p className="text-xs text-gray-400 mb-4 text-center">We value your feedback!</p>
        <div className="mb-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-300"
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
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-500"
            placeholder="Your Designation"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-gray-700">Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
          />
        </div>
        <div className="mb-2">
          <input
            type="url"
            name="photoUrl"
            value={form.photoUrl}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white placeholder-gray-300"
            placeholder="Photo URL (optional)"
            style={{ display: 'none' }}
          />
        </div>
        <div className="mb-2">
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm mb-2 focus:outline-none bg-white text-gray-800"
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
            className="w-full border border-gray-200 focus:border-black rounded px-3 py-1.5 text-sm focus:outline-none bg-white placeholder-gray-500 resize-none"
            rows={2}
            maxLength={180}
            placeholder="Your feedback (max 180 chars)"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-2 text-center text-xs">{error}</p>}
        {success && <p className="text-green-600 mb-2 text-center text-xs">Thank you for your feedback!</p>}
        <button
          type="submit"
          className={`w-full ${color?.button || 'bg-black hover:bg-gray-800'} text-white font-bold py-2 px-4 rounded-lg shadow transition text-sm mt-1`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default TestimonialSection;
