import React from 'react';

const UserPageError = ({ error, onRetry }) => (
  <div className="min-h-[300px] flex flex-col items-center justify-center py-12">
    <svg className="h-10 w-10 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
    <p className="text-red-600 text-lg font-semibold mb-2">{error || 'Something went wrong.'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Retry
      </button>
    )}
  </div>
);

export default UserPageError;
