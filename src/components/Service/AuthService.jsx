import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  // Register new user
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login with email/password
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login/Register with Google
  async googleAuth(googleData) {
    const response = await api.post('/auth/google', {
      googleId: googleData.id,
      email: googleData.email,
      name: googleData.name,
      picture: googleData.picture,
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch {
      return { success: false, valid: false };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },
};

// User Service
export const userService = {
  // Get profile
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/user/profile', data);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Delete account
  async deleteAccount() {
    const response = await api.delete('/user/account');
    if (response.data.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return response.data;
  },
};

export default api;
