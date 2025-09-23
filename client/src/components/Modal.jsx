import React from 'react';

const Modal = ({ isOpen, onClose, children, width = 'max-w-lg', minHeight = 'min-h-[400px]' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/50">
      <div className={`rounded-2xl shadow-2xl p-0 w-full ${width} ${minHeight} relative animate-fadeIn`}>
        <button
          className="absolute top-6 cursor-pointer right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
