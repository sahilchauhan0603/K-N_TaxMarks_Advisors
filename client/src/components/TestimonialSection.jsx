import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
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

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || testimonials.length === 0) return;

    let animationFrameId;
    let isPaused = false;
    let scrollSpeed = 0.75; // Adjust speed here (higher = faster)

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Calculate the width of one set of testimonials
        // Each card is 350px + 24px gap (1.5rem = 24px)
        const cardWidth = 350 + 24;
        const singleSetWidth = testimonials.length * cardWidth;
        
        // Reset to beginning seamlessly when we've scrolled past one complete set
        if (scrollContainer.scrollLeft >= singleSetWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    // Start the animation
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [testimonials]);

  const handleShareExperience = () => {
    if (isAuthenticated) {
      navigate('/profile/testimonials');
    } else {
      navigate('/login', { state: { from: '/profile/testimonials' } });
    }
  };

  const getGradient = () => {
    const gradients = {
      'purple': 'from-purple-600 to-purple-800',
      'pink': 'from-pink-600 to-pink-800',
      'yellow': 'from-yellow-500 to-yellow-700',
      'green': 'from-teal-500 to-teal-700',
      'blue': 'from-blue-600 to-blue-800',
    };
    return gradients[colors.primary] || gradients['blue'];
  };

  return (
    <div className="mt-16">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${getGradient()} rounded-2xl p-8 mb-8 shadow-xl`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <FaQuoteLeft className="w-6 h-6" />
              <h2 className="text-3xl md:text-3xl font-bold">What Our Clients Say</h2>
            </div>
            <p className="text-lg opacity-90">Real experiences from real people</p>
          </div>
          <button
            onClick={handleShareExperience}
            className="bg-white cursor-pointer text-gray-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            Share Your Experience
          </button>
        </div>
      </div>

      {/* Testimonials Horizontal Scroll */}
      {testimonials.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
            <FaQuoteLeft className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials yet</h3>
          <p className="text-gray-500">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Triple testimonials for seamless infinite scroll */}
            {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={t._id || idx}
                className="flex-shrink-0 w-[350px] bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: colors.primary === 'purple' ? '#F3E8FF' : 
                                     colors.primary === 'pink' ? '#FCE7F3' : 
                                     colors.primary === 'yellow' ? '#FEF3C7' : 
                                     colors.primary === 'green' ? '#D1FAE5' : 
                                     colors.primary === 'blue' ? '#DBEAFE' : '#DBEAFE'
                    }}
                  >
                    <FaQuoteLeft 
                      className="w-4 h-4"
                      style={{
                        color: colors.primary === 'purple' ? '#7C3AED' : 
                               colors.primary === 'pink' ? '#EC4899' : 
                               colors.primary === 'yellow' ? '#EAB308' : 
                               colors.primary === 'green' ? '#10B981' : 
                               colors.primary === 'blue' ? '#3B82F6' : '#3B82F6'
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4 italic text-sm">
                  "{t.feedback}"
                </p>

                {/* Client Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={t.photoUrl || `https://ui-avatars.com/api/?name=${t.name}&background=random&size=48`}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=4F46E5&color=fff&size=48`;
                        }}
                      />
                      <MdVerified className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  
                  {/* Service Badge */}
                  <div 
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.primary === 'purple' ? '#F3E8FF' : 
                                     colors.primary === 'pink' ? '#FCE7F3' : 
                                     colors.primary === 'yellow' ? '#FEF3C7' : 
                                     colors.primary === 'green' ? '#D1FAE5' : 
                                     colors.primary === 'blue' ? '#DBEAFE' : '#DBEAFE',
                      color: colors.primary === 'purple' ? '#5B21B6' : 
                             colors.primary === 'pink' ? '#BE185D' : 
                             colors.primary === 'yellow' ? '#B45309' : 
                             colors.primary === 'green' ? '#047857' : 
                             colors.primary === 'blue' ? '#1D4ED8' : '#1D4ED8'
                    }}
                  >
                    {t.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialSection;
