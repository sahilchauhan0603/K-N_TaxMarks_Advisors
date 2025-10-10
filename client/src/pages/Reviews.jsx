import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { FaQuoteLeft, FaStar, FaUser, FaCalendarAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const Reviews = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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
            className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-800">
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
              Showing {filteredTestimonials.length} of {testimonials.length} reviews
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial, index) => (
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
            <a
              href="/"
              className="bg-white text-slate-700 hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
            >
              Explore Our Services
            </a>
            {/* <a
              href="/services"
              className="border-2 border-gray-400 text-gray-700 hover:bg-white hover:text-slate-800 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Services
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;