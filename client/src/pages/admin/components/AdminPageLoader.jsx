import React from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

export const AdminPageLoader = ({ message = 'Loading...', className = '' }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 ${className}`}>
    <FaSpinner className="animate-spin text-5xl text-blue-600 mb-6" />
    <p className="text-lg text-gray-700 font-semibold">{message}</p>
  </div>
);

export const AdminPageError = ({ error = 'Failed to load page. Please check your network connection and try again.', onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center ">
    <FaExclamationTriangle className="text-5xl text-red-500 mb-6" />
    <p className="text-lg text-red-700 font-semibold mb-2">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-6 cursor-pointer py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);
