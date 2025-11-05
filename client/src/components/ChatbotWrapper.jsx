import React, { useState } from 'react';
import AIChatbot from './AIChatbot';

const ChatbotWrapper = ({ serviceName = "General", buttonText = "Ask AI Assistant", buttonClassName = "" }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatbotOpen(true)}
        className={`bg-white text-green-600 hover:bg-gray-100 cursor-pointer font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 text-center flex items-center justify-center space-x-2 ${buttonClassName}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        <span>{buttonText}</span>
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