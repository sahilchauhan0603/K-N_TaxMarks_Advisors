import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { FaQuoteLeft, FaStar, FaUser, FaCalendarAlt, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const SERVICE_OPTIONS = [
  'Trademark',
  'Business Advisory',
  'GST Filing',
  'ITR Filing',
  'Tax Planning',
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

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  
  // Pagination states - Changed to load more pattern
  const [displayedCount, setDisplayedCount] = useState(8); // Show 8 initially
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_LOAD = 8; // Load 8 more at a time
  
  // Touch/Swipe support - Remove since not needed for scroll view
  // const [touchStart, setTouchStart] = useState(0);
  // const [touchEnd, setTouchEnd] = useState(0);

  // Get displayed testimonials based on current count
  const displayedTestimonials = filteredTestimonials.slice(0, displayedCount);
  const hasMoreTestimonials = displayedCount < filteredTestimonials.length;

  const services = [
    'Business Advisory',
    'GST Filing',
    'ITR Filing', 
    'Tax Planning',
    'Trademark'
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    filterAndSortTestimonials();
  }, [testimonials, searchTerm, selectedService, sortBy]);

  useEffect(() => {
    // Reset displayed count when filters change
    setDisplayedCount(ITEMS_PER_LOAD);
  }, [searchTerm, selectedService, sortBy]);

  // Handle redirect after login to open testimonial form
  useEffect(() => {
    // Check if user just logged in and came from reviews page with intention to write review
    if (user && location.state?.openTestimonialForm) {
      setShowTestimonialForm(true);
      // Clear the state to prevent reopening form on subsequent visits
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [user, location.state, navigate, location.pathname]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTestimonials = () => {
    let filtered = testimonials.filter(testimonial => {
      const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService = !selectedService || testimonial.service === selectedService;
      
      return matchesSearch && matchesService;
    });

    // Sort testimonials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTestimonials(filtered);
  };

  // Load more testimonials function
  const loadMoreTestimonials = () => {
    setLoadingMore(true);
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayedCount(prev => prev + ITEMS_PER_LOAD);
      setLoadingMore(false);
    }, 500);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getServiceIcon = (service) => {
    const icons = {
      'Business Advisory': '🏢',
      'GST Filing': '📋',
      'ITR Filing': '📊',
      'Tax Planning': '💰',
      'Trademark': '⚖️'
    };
    return icons[service] || '⭐';
  };

  const getServiceColor = (service) => {
    const colors = {
      'Business Advisory': 'bg-pink-100 text-pink-800 border-pink-200',
      'GST Filing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ITR Filing': 'bg-green-100 text-green-800 border-green-200',
      'Tax Planning': 'bg-blue-100 text-blue-800 border-blue-200',
      'Trademark': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[service] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleWriteReview = () => {
    if (!user) {
      // Show the same login popup as used for services links in the footer
      if (typeof window.setShowAuthPopup === 'function') {
        window.setShowAuthPopup(true);
        setTimeout(() => {
          navigate('/login?redirectTo=' + encodeURIComponent('/reviews?openTestimonialForm=true'));
          window.setShowAuthPopup(false);
        }, 1200);
      } else {
        navigate('/login?redirectTo=' + encodeURIComponent('/reviews?openTestimonialForm=true'));
      }
    } else {
      // Open testimonial form for authenticated users
      setShowTestimonialForm(true);
    }
  };

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchTestimonials}
            className="bg-slate-500 hover:bg-slate-600 text-white px-6 cursor-pointer py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-100 to-gray-200 text-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-90 rounded-full mb-4 shadow-md">
              <FaQuoteLeft className="w-10 h-10 text-slate-600" />
            </div>
          </div> */}
          <h1 className="text-4xl md:text-4xl font-bold mb-6 leading-tight text-gray-800">
            Client Reviews & Testimonials
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover what our clients say about their experience with K&N Tax Marks Advisors
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(5)}</div>
              <span>5.0 Rating</span>
            </div>
            <div className="flex items-center">
              <MdVerified className="w-5 h-5 mr-2" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center">
              <FaUser className="w-5 h-5 mr-2" />
              <span>{testimonials.length}+ Happy Clients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Showing {displayedTestimonials.length} of {filteredTestimonials.length} reviews
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No reviews found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {testimonial.photoUrl ? (
                      <img
                        src={testimonial.photoUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MdVerified className="w-5 h-5 text-green-500" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">{renderStars(5)}</div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>

                {/* Service Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getServiceColor(testimonial.service)}`}>
                    <span className="mr-1">{getServiceIcon(testimonial.service)}</span>
                    {testimonial.service}
                  </span>
                </div>

                {/* Feedback */}
                <div className="mb-4">
                  <FaQuoteLeft className="text-gray-300 w-4 h-4 mb-2" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.feedback}"
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  {formatDate(testimonial.createdAt)}
                </div>
              </div>
            ))}
            </div>

            {/* Show More/Less Buttons */}
            {(hasMoreTestimonials || displayedCount > ITEMS_PER_LOAD) && (
              <div className="flex justify-center gap-4 pt-8">
                {/* Show Less Button */}
                {displayedCount > ITEMS_PER_LOAD && (
                  <button
                    onClick={() => setDisplayedCount(ITEMS_PER_LOAD)}
                    className="cursor-pointer bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 min-w-48"
                  >
                    <span>Less</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}

                {/* Show More Button */}
                {hasMoreTestimonials && (
                  <button
                    onClick={loadMoreTestimonials}
                    disabled={loadingMore}
                    className="cursor-pointer bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 min-w-48"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>More</span>
                        <div className="bg-white/20 px-2 py-1 rounded-full text-xs">
                          +{Math.min(ITEMS_PER_LOAD, filteredTestimonials.length - displayedCount)}
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-slate-200 to-gray-300 rounded-2xl p-8 md:p-12 text-gray-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Happy Clients?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the same level of professional service and expertise that our clients rave about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWriteReview}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-bold py-3 px-8 cursor-pointer rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              ✍️ Write a Review
            </button>
            <Link 
              to="/"
              className="border-2 border-gray-400 text-gray-700 hover:bg-white hover:text-slate-800 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <TestimonialForm
          onClose={() => setShowTestimonialForm(false)}
          onSuccess={() => {
            setShowTestimonialForm(false);
            fetchTestimonials(); // Refresh testimonials after submission
          }}
        />
      )}
    </div>
  );
};

// Testimonial Form Component
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
      
      // Use appropriate endpoint based on authentication status
      const endpoint = user ? '/api/testimonials' : '/api/testimonials/public';
      
      await axios.post(endpoint, formData, config);
      
      // Show success message with SweetAlert
      await Swal.fire({
        title: '🎉 Thank You!',
        html: `
          <div class="text-center space-y-3">
            <div class="text-green-600 text-4xl mb-3">✅</div>
            <p class="text-lg font-medium text-gray-800">Your review has been submitted successfully!</p>
            <p class="text-sm text-gray-600">Thank you for sharing your experience with us.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
        confirmButtonText: '✅ Continue',
        timer: 3000,
        timerProgressBar: true
      });
      
      onSuccess();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      await Swal.fire({
        title: '❌ Submission Failed',
        text: err.response?.data?.message || 'Failed to submit your review. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        confirmButtonText: 'Try Again'
      });
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
      <form
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-lg relative border border-gray-200 animate-fadeIn max-h-screen overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-black text-xl sm:text-2xl focus:outline-none z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg sm:text-xl font-extrabold mb-2 text-gray-800 text-center tracking-tight pr-8">
          Share Your Experience
        </h3>
        <p className="text-xs text-gray-400 mb-4 text-center">
          We value your feedback!
        </p>

        <div className="mb-3 sm:mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-2 text-sm focus:outline-none bg-white placeholder-gray-300 transition-colors"
            placeholder="Your Name"
            required
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-2 text-sm focus:outline-none bg-white placeholder-gray-500 transition-colors"
            placeholder="Your Designation"
            required
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Upload Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-2 text-sm focus:outline-none bg-white transition-colors file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full cursor-pointer border border-gray-200 focus:border-blue-500 rounded px-3 py-2 text-sm focus:outline-none bg-white text-gray-800 transition-colors"
            required
          >
            <option value="">Select Service</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 sm:mb-4">
          <textarea
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
            className="w-full border border-gray-200 focus:border-blue-500 rounded px-3 py-2 text-sm focus:outline-none bg-white placeholder-gray-500 resize-none transition-colors"
            rows={4}
            maxLength={250}
            placeholder="Your feedback (max 250 chars)"
            required
          />
          <div className="text-xs text-gray-400 text-right mt-1">
            {form.feedback.length}/250 characters
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-xs sm:text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-4 text-xs sm:text-sm text-center">
            Thank you for your feedback!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold py-2.5 px-4 rounded-lg shadow transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default Reviews;