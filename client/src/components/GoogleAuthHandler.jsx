import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple processing
    if (processedRef.current) {
      return;
    }

    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    console.log('GoogleAuthHandler - Token:', !!token, 'Name:', name, 'Email:', email, 'Error:', error);

    if (error) {
      console.error('Google OAuth error:', error);
      processedRef.current = true;
      navigate('/login?error=' + error, { replace: true });
      return;
    }

    if (token && name) {
      console.log('Processing Google OAuth success...');
      processedRef.current = true;
      
      handleGoogleCallback(token, decodeURIComponent(name), email ? decodeURIComponent(email) : '');
      
      // Navigate to home after successful authentication
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } else {
      console.log('Missing token or name, redirecting to login');
      processedRef.current = true;
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-3 text-gray-700">Processing authentication...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthHandler;