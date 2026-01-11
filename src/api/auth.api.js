import axiosInstance from './axios';

export const authAPI = {
  // Register
  register: async (data) => {
    return axiosInstance.post('/auth/register', data);
  },

  getAllUsers: async () => {
  const response = await axiosInstance.get('/auth/getAllUsers');
  return response;
},

  // Login
  login: async (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  // Get current user
  getMe: async () => {
    return axiosInstance.get('/auth/me');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return axiosInstance.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return axiosInstance.post(`/auth/reset-password/${token}`, { password });
  },

  // Verify email
  verifyEmail: async (token) => {
    return axiosInstance.get(`/auth/verify-email/${token}`);
  }
};