import React, { useState, useEffect } from 'react';
import { FiUsers, FiCheckCircle, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import axios from '../utils/axios';

const HeadlineBanner = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalServices: 0,
    satisfactionRate: 0,
    testimonials: 0,
    yearsOfExperience: 15
  });
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/public');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Use default fallback stats
        setStats({
          totalClients: 1000,
          totalServices: 500,
          satisfactionRate: 98.5,
          testimonials: 150,
          yearsOfExperience: 15
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const headlines = [
    {
      icon: <FiUsers className="w-4 h-4" />,
      text: `${stats.totalClients.toLocaleString()}+ Happy Clients Trust Us`,
      subtext: "Join thousands of satisfied customers",
      gradient: "from-blue-500 to-cyan-500",
      textColor: "text-blue-700"
    },
    {
      icon: <FiCheckCircle className="w-4 h-4" />,
      text: `${stats.totalServices.toLocaleString()}+ Services Delivered Successfully`,
      subtext: "Excellence in every filing",
      gradient: "from-green-500 to-emerald-500",
      textColor: "text-green-700"
    },
    {
      icon: <FiStar className="w-4 h-4" />,
      text: `${stats.satisfactionRate}% Client Satisfaction Rate`,
      subtext: "Rated excellent by our clients",
      gradient: "from-amber-500 to-orange-500",
      textColor: "text-amber-700"
    },
    {
      icon: <FiAward className="w-4 h-4" />,
      text: `${stats.yearsOfExperience}+ Years of Trusted Expertise`,
      subtext: "Experience you can count on",
      gradient: "from-purple-500 to-pink-500",
      textColor: "text-purple-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [headlines.length]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
            <div className="h-3 bg-blue-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 py-2 overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent animate-shimmer"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          {/* Rotating Headlines */}
          <div className="flex items-center gap-2 min-h-[36px] transition-all duration-500 ease-in-out">
            <div className={`bg-gradient-to-r ${headlines[currentHeadline].gradient} p-1.5 rounded-full shadow-md transform transition-transform duration-500 hover:scale-110 animate-pulse-gentle`}>
              <div className="text-white animate-spin-slow">
                {headlines[currentHeadline].icon}
              </div>
            </div>
            <div className="flex flex-col">
              <div className={`font-bold text-xs md:text-sm ${headlines[currentHeadline].textColor} animate-slide-in-right`}>
                {headlines[currentHeadline].text}
              </div>
              <div className="text-[10px] md:text-xs text-gray-600 animate-slide-in-right-delay">
                {headlines[currentHeadline].subtext}
              </div>
            </div>
          </div>

          {/* Stats Pills - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-white/80 transition-all duration-300 border border-blue-200 shadow-sm animate-float">
              <FiTrendingUp className="w-3.5 h-3.5 text-green-600 animate-bounce-slow" />
              <span className="text-[11px] font-semibold text-gray-700">
                {stats.totalServices.toLocaleString()}+ Services
              </span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-white/80 transition-all duration-300 border border-purple-200 shadow-sm animate-float-delay">
              <FiStar className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span className="text-[11px] font-semibold text-gray-700">
                {stats.satisfactionRate}% Satisfaction
              </span>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 mt-1.5">
          {headlines.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeadline(index)}
              className={`transition-all duration-300 rounded-full animate-pulse-dot ${
                index === currentHeadline
                  ? 'w-5 h-1 bg-blue-500'
                  : 'w-1 h-1 bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Go to headline ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right-delay {
          0% {
            opacity: 0;
            transform: translateX(-15px);
          }
          40% {
            opacity: 0;
            transform: translateX(-15px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-right-delay {
          animation: slide-in-right-delay 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 3s ease-in-out infinite 0.5s;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeadlineBanner;
