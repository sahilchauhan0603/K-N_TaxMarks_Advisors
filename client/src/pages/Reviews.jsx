import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/axios";
import {
  FaStar,
  FaUser,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";

const SERVICE_OPTIONS = [
  "Trademark",
  "Business Advisory",
  "GST Filing",
  "ITR Filing",
  "Tax Planning",
];

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  // Pagination states - Changed to load more pattern
  const [displayedCount, setDisplayedCount] = useState(8); // Show 8 initially
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_LOAD = 9; // Load 8 more at a time

  // Get displayed testimonials based on current count
  const displayedTestimonials = filteredTestimonials.slice(0, displayedCount);
  const hasMoreTestimonials = displayedCount < filteredTestimonials.length;

  const services = [
    "Business Advisory",
    "GST Filing",
    "ITR Filing",
    "Tax Planning",
    "Trademark",
  ];

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/testimonials");
      setTestimonials(response.data);
    } catch (err) {
      setError("Failed to load testimonials");
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTestimonials = useCallback(() => {
    let filtered = testimonials.filter((testimonial) => {
      const matchesSearch =
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesService =
        !selectedService || testimonial.service === selectedService;

      return matchesSearch && matchesService;
    });

    // Sort testimonials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm, selectedService, sortBy]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    filterAndSortTestimonials();
  }, [filterAndSortTestimonials]);

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

  // Load more testimonials function
  const loadMoreTestimonials = () => {
    setLoadingMore(true);
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayedCount((prev) => prev + ITEMS_PER_LOAD);
      setLoadingMore(false);
    }, 500);
  };

  // Show less testimonials function
  const showLessTestimonials = () => {
    setDisplayedCount(ITEMS_PER_LOAD);
    // Smooth scroll to top of testimonials section
    const testimonialsSection = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getServiceColor = (service) => {
    const colors = {
      "Business Advisory": "bg-slate-100 text-slate-700 border-slate-300",
      "GST Filing": "bg-slate-100 text-slate-700 border-slate-300",
      "ITR Filing": "bg-slate-100 text-slate-700 border-slate-300",
      "Tax Planning": "bg-slate-100 text-slate-700 border-slate-300",
      Trademark: "bg-slate-100 text-slate-700 border-slate-300",
    };
    return colors[service] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  const getServiceIcon = (service) => {
    const icons = {
      "Business Advisory": "🏢",
      "GST Filing": "📋",
      "ITR Filing": "📊",
      "Tax Planning": "💰",
      Trademark: "⚖️",
    };
    return icons[service] || "⭐";
  };

  const handleWriteReview = () => {
    if (!user) {
      // Show the same login popup as used for services links in the footer
      if (typeof window.setShowAuthPopup === "function") {
        window.setShowAuthPopup(true);
        setTimeout(() => {
          navigate(
            "/login?redirectTo=" +
              encodeURIComponent("/reviews?openTestimonialForm=true"),
          );
          window.setShowAuthPopup(false);
        }, 1200);
      } else {
        navigate(
          "/login?redirectTo=" +
            encodeURIComponent("/reviews?openTestimonialForm=true"),
        );
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
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 cursor-pointer py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-300 py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">
              Client Reviews & Testimonials
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover what our clients say about their experience with K&N Tax
              Marks Advisors. Real feedback from real clients.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 font-medium">5.0 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <MdVerified className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">
                  Verified Reviews
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-slate-600" />
                <span className="text-gray-700 font-medium">
                  {testimonials.length}+ Satisfied Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Filters Section */}
      <div className="max-w-6xl mx-auto px-1 sm:px-1 lg:px-1 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, feedback, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all bg-white"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Filter */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white text-gray-900 cursor-pointer"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white text-gray-900 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing <strong>{displayedTestimonials.length}</strong> of{" "}
              <strong>{filteredTestimonials.length}</strong> reviews
            </span>
            {(searchTerm || selectedService) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedService("");
                }}
                className="text-slate-600 hover:text-slate-900 border-1 py-1 px-4 rounded-2xl font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start flex-1">
                      {testimonial.photoUrl ? (
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    {testimonial.verified !== false && (
                      <MdVerified className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex gap-0.5">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {testimonial.rating || 5}.0
                    </span>
                  </div>

                  {/* Service Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getServiceColor(testimonial.service)}`}
                    >
                      <span className="mr-1.5">
                        {getServiceIcon(testimonial.service)}
                      </span>
                      {testimonial.service}
                    </span>
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-700 leading-relaxed flex-1 mb-4 text-sm">
                    "{testimonial.feedback}"
                  </p>

                  {/* Date */}
                  <div className="flex items-center text-xs text-gray-500 pt-4 border-t border-slate-100">
                    <FaCalendarAlt className="w-3.5 h-3.5 mr-2" />
                    {formatDate(testimonial.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreTestimonials && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={loadMoreTestimonials}
                  disabled={loadingMore}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Reviews</span>
                      <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                        +
                        {Math.min(
                          ITEMS_PER_LOAD,
                          filteredTestimonials.length - displayedCount,
                        )}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Show Less Button */}
            {!hasMoreTestimonials && displayedCount > ITEMS_PER_LOAD && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={showLessTestimonials}
                  className="bg-white hover:bg-gray-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 font-semibold py-3 px-8 rounded-lg shadow transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Show Less</span>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded-full">
                    ↑
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-slate-900 rounded-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with Us?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust K&N Tax Marks Advisors
            with their professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWriteReview}
              className="bg-white text-slate-900 hover:bg-gray-100 font-semibold py-3 px-8 cursor-pointer rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Share Your Review
            </button>
            <Link
              to="/"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-3 px-8 rounded-lg transition-colors"
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
    name: user?.name || "",
    role: user?.role || "",
    photoUrl: user?.photoUrl || "",
    service: "",
    feedback: "",
    rating: 5,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("service", form.service);
      formData.append("feedback", form.feedback);
      formData.append("rating", form.rating);
      formData.append("verified", true);
      if (imageFile) {
        formData.append("photo", imageFile);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      // Use appropriate endpoint based on authentication status
      const endpoint = user ? "/api/testimonials" : "/api/testimonials/public";

      await axios.post(endpoint, formData, config);

      // Show success message with SweetAlert
      await Swal.fire({
        title: "Thank You!",
        html: `
          <div class="text-center space-y-3">
            <div class="text-green-600 text-4xl mb-3">✓</div>
            <p class="text-lg font-medium text-gray-800">Your review has been submitted successfully</p>
            <p class="text-sm text-gray-600">We appreciate your feedback and will review it shortly.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#1f2937",
        confirmButtonText: "Done",
        timer: 3000,
        timerProgressBar: true,
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
      await Swal.fire({
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          "Failed to submit your review. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        role: user.role || "",
        photoUrl: user.photoUrl || "",
      }));
    }
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg relative border border-slate-200 max-h-screen overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl focus:outline-none z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h3 className="text-2xl font-bold mb-2 text-gray-900 pr-8">
          Share Your Experience
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Help other clients make informed decisions. Your honest feedback
          matters.
        </p>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-slate-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white placeholder-gray-400 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-slate-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white placeholder-gray-400 transition-colors"
              placeholder="e.g., Business Owner, CA, etc."
              required
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-slate-200 focus:border-slate-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-slate-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white text-gray-900 transition-colors cursor-pointer"
              required
            >
              <option value="">Select the service you used</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="cursor-pointer p-1 transition-transform hover:scale-110"
                >
                  <FaStar
                    className={`w-8 h-8 ${
                      star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              className="w-full border border-slate-200 focus:border-slate-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white placeholder-gray-400 resize-none transition-colors"
              rows={5}
              maxLength={500}
              placeholder="Share your experience with us (max 500 characters)"
              required
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {form.feedback.length}/500 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reviews;