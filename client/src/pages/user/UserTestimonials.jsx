import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const SERVICE_OPTIONS = [
  "Trademark",
  "Business Advisory",
  "GST Filing",
  "ITR Filing",
  "Tax Planning",
];

const UserTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchMyTestimonials();
  }, []);

  const fetchMyTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/testimonials/my");
      setTestimonials(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await axios.delete(`/api/testimonials/${id}`);
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete testimonial");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTestimonials = testimonials.slice(startIndex, endIndex);

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
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Testimonials
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your submitted testimonials and their approval status.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="relative group">
              <button
                onClick={fetchMyTestimonials}
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 cursor-pointer text-white px-3 py-2.5 sm:px-3 sm:py-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all duration-200 text-sm whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 hover:scale-105 text-white cursor-pointer px-3 py-2.5 sm:px-3 sm:py-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all duration-200 text-sm whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <span>New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{testimonials.length}</p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Approved</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {testimonials.filter(t => t.isApproved).length}
                </p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {testimonials.filter(t => !t.isApproved).length}
                </p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Latest</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  {testimonials.length > 0 
                    ? new Date(testimonials[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'None'
                  }
                </p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
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
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No testimonials yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any testimonials yet. Share your experience
              with our services!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-4 py-2 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span>Submit Your First Testimonial</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {paginatedTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      {testimonial.photoUrl && (
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
                        />
                      )}
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">{testimonial.role}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Service: {testimonial.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end space-x-2 w-full sm:w-auto">
                      {getStatusBadge(testimonial.isApproved)}
                      <button
                        onClick={() => deleteTestimonial(testimonial._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete testimonial"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-700 italic text-sm sm:text-base">
                      "{testimonial.feedback}"
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    Submitted on{" "}
                    {new Date(testimonial.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 gap-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                  <span>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, testimonials.length)} of{" "}
                    {testimonials.length} testimonials
                  </span>
                </div>
                <div className="flex items-center space-x-2 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showForm && (
          <TestimonialForm
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    // </div>
  );
};

const TestimonialForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    role: user?.role || "",
    photoUrl: user?.photoUrl || "",
    service: "",
    feedback: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
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
      if (imageFile) {
        formData.append("photo", imageFile);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      // Use authenticated endpoint since user is logged in
      const response = await axios.post("/api/testimonials", formData, config);

      setSuccess(true);
      setError("");

      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
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
    <div className="fixed inset-0 backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4">
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

export default UserTestimonials;
