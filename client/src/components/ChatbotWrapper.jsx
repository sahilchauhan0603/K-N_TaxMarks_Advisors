import React, { useState } from 'react';
import AIChatbot from './AIChatbot';

const ChatbotWrapper = ({ serviceName = "General", buttonText = "Ask AI !", buttonClassName = "" }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatbotOpen(true)}
        className={`group relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 hover:from-blue-600 hover:via-purple-600 hover:to-red-700 text-white font-bold py-1 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer flex items-center justify-center space-x-3 border-2 border-white/20 backdrop-blur-sm ${buttonClassName}`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-2xl bg-red-500/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          <svg className="w-6 h-6 text-white group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-start">
          <span className="text-lg font-bold text-white group-hover:text-white transition-colors duration-300">{buttonText}</span>
          {/* <span className="text-xs text-blue-100 group-hover:text-white/90 transition-colors duration-300">Get instant help with {serviceName}</span> */}
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>
        
        {/* Sparkle Elements */}
        <div className="absolute top-2 right-4 w-2 h-2 bg-white rounded-full opacity-80 animate-ping group-hover:animate-pulse"></div>
        <div className="absolute bottom-3 left-6 w-1 h-1 bg-blue-200 rounded-full opacity-40 animate-pulse group-hover:animate-ping"></div>
      </button>
      
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
        serviceName={serviceName} 
      />
    </>
  );
};

export default ChatbotWrapper;