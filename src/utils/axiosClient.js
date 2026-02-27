// ============================================
// AXIOS API CLIENT - Easy to Understand Version
// ============================================
// This file handles ALL communication with the backend server
// Think of it as a "messenger" between your React app and the server

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// ============================================
// STEP 1: Create axios instance
// ============================================
// This is like creating a custom "messenger" with default settings
// Instead of writing the full URL every time, we set it once here

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    
    if (authData) {
      const { token, user_id } = JSON.parse(authData);
      config.headers['token'] = token;
      config.headers['user-id'] = user_id;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// STEP 3: Response Interceptor (AFTER receiving)
// ============================================
// This runs AFTER every response comes back from the server
// Think of it as a "mail sorter" that checks if the response is good or bad

axiosClient.interceptors.response.use(
  (response) => {
    // If response is successful (status 200-299), just return the data
    return response.data; // axios automatically parses JSON for us!
  },
  async (error) => {
    // If response has an error, handle it here
    const originalRequest = error.config;

    // Skip token refresh for login endpoints
    if (originalRequest.url?.includes('/api/auth/login')) {
      return Promise.reject(error);
    }

    // ============================================
    // Handle 401 Unauthorized (Token expired)
    // ============================================
    // If server says "your token is expired", try to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we tried once (prevent infinite loop)

      try {
        // Try to get a new token using refresh token
        const newToken = await refreshToken();
        
        originalRequest.headers['token'] = newToken;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If refresh also fails, logout user
        logout();
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // ============================================
    // Handle other errors
    // ============================================
    if (error.code === 'ECONNABORTED') {
      error.message = 'Server is not responding';
    } else if (!error.response) {
      error.message = 'Cannot connect to server. Please check your network connection.';
    }
    return Promise.reject(error);
  }
);

// ============================================
// STEP 4: Helper Functions
// ============================================

// Function to refresh expired token
async function refreshToken() {
  const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
  
  if (!authData) {
    throw new Error('INVALID_TOKEN');
  }

  const { refresh_token, user_id, is_admin } = JSON.parse(authData);

  // Call backend to get new token
  const response = await axios.post(`${API_BASE_URL}/api/auth/login-with-token/`, {
    user_id,
    token: JSON.parse(authData).token,
    refresh_token,
    is_admin,
  });

  const { token, refresh_token: newRefreshToken } = response.data;

  // Save new tokens
  const newAuthData = {
    ...JSON.parse(authData),
    token,
    refresh_token: newRefreshToken,
  };

  if (localStorage.getItem('authData')) {
    localStorage.setItem('authData', JSON.stringify(newAuthData));
  } else {
    sessionStorage.setItem('authData', JSON.stringify(newAuthData));
  }

  return token;
}

// Function to logout user
function logout() {
  localStorage.removeItem('authData');
  sessionStorage.removeItem('authData');
  localStorage.removeItem('lastLogin');
}

// ============================================
// EXPORT the configured axios client
// ============================================
export default axiosClient;

// ============================================
// HOW TO USE THIS IN YOUR COMPONENTS:
// ============================================
// import axiosClient from './utils/axiosClient';
//
// // GET request
// const users = await axiosClient.get('/api/users');
//
// // POST request
// const result = await axiosClient.post('/api/login/', { username, password });
//
// // PUT request
// const updated = await axiosClient.put('/api/users/123', { name: 'New Name' });
//
// // DELETE request
// await axiosClient.delete('/api/users/123');
