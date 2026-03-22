import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
    }
  };

  const register = async (name, email, otp, password, phone, state) => {
    try {
      const response = await axios.post('/api/verify-otp', { name, email, otp, password, phone, state });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'An error occurred during registration' };
    }
  };

  const sendOTP = async (email) => {
    try {
      const response = await axios.post('/api/send-otp', { email });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error sending OTP' };
    }
  };

  const completeGoogleProfile = async (token, phone, state) => {
    try {
      const response = await axios.post('/api/auth/complete-profile', { token, phone, state });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
  };

  const handleGoogleCallback = async (token, name, email) => {
    try {
      if (!token) {
        return { success: false, message: 'Invalid Google auth token' };
      }

      localStorage.setItem('token', token);

      // Verify token with backend so Google sign-in also follows server auth flow.
      const verifyResponse = await axios.get('/api/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const verifiedUser = verifyResponse.data?.user;
      let userData = {
        name: verifiedUser?.name || name || '',
        email: verifiedUser?.email || email || '',
      };

      // Fetch full profile fields if available.
      if (userData.email) {
        try {
          const profileResponse = await axios.get(`/api/user?email=${encodeURIComponent(userData.email)}`);
          if (profileResponse.data) {
            userData = profileResponse.data;
          }
        } catch (profileError) {
          // Keep verified fallback user data when profile endpoint fails.
        }
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Google sign-in failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    if (navigate) {
      navigate('/');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        sendOTP,
        completeGoogleProfile,
        handleGoogleCallback,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);