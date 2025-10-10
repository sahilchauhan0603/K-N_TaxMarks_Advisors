import React, { useState } from 'react';
import axios from '../utils/axios';
import { FaPaperPlane, FaLightbulb, FaUser, FaEnvelope, FaTag, FaExclamationTriangle } from 'react-icons/fa';
import { MdSubject, MdMessage } from 'react-icons/md';

const UserSuggestions = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General Feedback',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Website UI/UX',
    'Service Quality', 
    'New Service Request',
    'Technical Issue',
    'General Feedback',
    'Other'
  ];

  const priorities = [
    'Low',
    'Medium', 
    'High'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/suggestions', formData);
      setSuccess(response.data.message);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'General Feedback',
        priority: 'Medium'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Website UI/UX': '🎨',
      'Service Quality': '⭐',
      'New Service Request': '🆕',
      'Technical Issue': '🔧',
      'General Feedback': '💭',
      'Other': '📝'
    };
    return icons[category] || '💭';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'High': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || colors['Medium'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-200 rounded-full mb-6 shadow-md">
            <FaLightbulb className="w-8 h-8 text-slate-600" />
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Share Your Suggestions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us improve K&N Tax Marks Advisors by sharing your valuable feedback and suggestions
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaPaperPlane className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="inline w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaTag className="inline w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaExclamationTriangle className="inline w-4 h-4 mr-2" />
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}>
                    {formData.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MdSubject className="inline w-4 h-4 mr-2" />
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                placeholder="Brief description of your suggestion"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MdMessage className="inline w-4 h-4 mr-2" />
                Detailed Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors resize-vertical"
                placeholder="Please provide detailed information about your suggestion or feedback..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Minimum 10 characters. Be as specific as possible to help us understand your suggestion better.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center cursor-pointer px-8 py-4 bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-3" />
                    Submit Suggestion
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            How We Use Your Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl mb-3">👥</div>
              <h4 className="font-semibold text-gray-800 mb-2">Team Review</h4>
              <p className="text-gray-600 text-sm">Our team carefully reviews every suggestion to understand your needs</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-800 mb-2">Implementation</h4>
              <p className="text-gray-600 text-sm">Valuable suggestions are prioritized for website and service improvements</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="font-semibold text-gray-800 mb-2">Continuous Improvement</h4>
              <p className="text-gray-600 text-sm">Your feedback helps us continuously enhance your experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestions;