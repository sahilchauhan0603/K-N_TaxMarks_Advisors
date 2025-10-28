import React from 'react';

const Modal = ({ isOpen, onClose, children, width = 'max-w-lg', minHeight = 'min-h-[400px]' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/50 p-4">
      <div className={`rounded-2xl shadow-2xl p-0 w-full ${width} ${minHeight} max-h-[90vh] relative animate-fadeIn overflow-hidden`}>
        <button
          className="absolute top-1 cursor-pointer right-1 text-gray-800 hover:text-black text-2xl font-bold focus:outline-none z-10 rounded-full w-8 h-8 flex items-center justify-center"
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
