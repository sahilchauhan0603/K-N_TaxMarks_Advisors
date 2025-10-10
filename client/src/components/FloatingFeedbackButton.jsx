import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";

const FloatingFeedbackButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/suggestions");
  };

  // Only show on homepage and not on suggestions page
  if (location.pathname !== "/" || location.pathname === "/suggestions") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Tooltip/Message */}
      <div
        className={`absolute bottom-full left-1 transform -translate-x-1 mb-3 transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-gray-800 text-white rounded-lg shadow-xl px-3 py-2 whitespace-nowrap">
          <p className="text-sm font-medium">
            Help us improve! Share your feedback
          </p>
          {/* Arrow pointing down - centered */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Main Button - Smaller Size */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 
          hover:from-amber-500 hover:via-orange-500 hover:to-orange-600
          text-white rounded-full p-3 shadow-md hover:shadow-lg 
          transition-all duration-300 transform hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50
          custom-pulse hover:animate-none
          active:scale-95 cursor-pointer
        `}
        // title="Share your feedback"
      >
        {/* Reduced rippling effect circles */}
        <div className="absolute inset-0 rounded-full bg-orange-300 opacity-50 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-ping animation-delay-1000"></div>

        {/* Smaller Icon */}
        <FaLightbulb
          className={`relative z-10 w-4 h-4 transition-all duration-300 ${
            isHovered ? "gentle-bounce text-yellow-100" : "text-white"
          }`}
        />

        {/* Reduced glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 opacity-0 group-hover:opacity-40 blur-lg transition-all duration-300 transform group-hover:scale-125"></div>
      </button>

      {/* Additional CSS for enhanced animations */}
      <style jsx="true">{`
        @keyframes gentle-bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @media (max-width: 640px) {
          .floating-feedback-button {
            bottom: 1rem;
            left: 1rem;
          }
        }

        /* Custom pulse animation for the main button */
        .custom-pulse {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* Gentle bounce for icon on hover */
        .gentle-bounce {
          animation: gentle-bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingFeedbackButton;
