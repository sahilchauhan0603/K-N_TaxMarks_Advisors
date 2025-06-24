import React from 'react';
import './LoadingBar.css';

const LoadingBar = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loading-bar">
        <div className="loading-bar-progress"></div>
      </div>
    )
  );
};

export default LoadingBar;
