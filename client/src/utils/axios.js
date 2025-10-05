import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', 
  // baseURL: 'https://k-n-taxmarks-advisors-backend.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    // Check if this is an admin route
    const isAdminRoute = config.url?.includes('/admin') || config.url?.includes('admin');
    
    let token;
    if (isAdminRoute) {
      // Use admin token for admin routes
      token = localStorage.getItem('adminToken');
    } else {
      // Use regular user token for user routes
      token = localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this was an admin route
      const isAdminRoute = error.config?.url?.includes('/admin') || error.config?.url?.includes('admin');
      
      if (isAdminRoute) {
        // Admin token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
        window.location.href = '/admin/login';
      } else {
        // User token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;