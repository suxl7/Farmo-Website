// ============================================
// AUTH SERVICE - Using Axios
// ============================================
import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  
  // LOGIN - When user enters username & password
  async login(identifier, password, is_admin = true, device_info = "") {
    try {
      console.log('Login attempt:', { identifier, is_admin, device_info });
      
      const response = await axiosClient.post(API_ENDPOINTS.LOGIN, {
        identifier,
        password,
        is_admin,
        device_info,
      });

      // axiosClient interceptor returns response.data directly
      const data = response;
      console.log('Login response data:', data);

      // Validate server response
      if (data.token && data.refresh_token && data.user_id) {
        // Validate user type for admin access
        const userType = data.user_type?.toUpperCase();
        console.log('Login successful - User type:', data.user_type, 'Uppercase:', userType);
        
        if (userType !== 'ADMIN' && userType !== 'SUPERADMIN') {
          console.log('Access denied for user type:', userType);
          throw new Error("Access denied. Admin or SuperAdmin privileges required.");
        }

        console.log('User type validated successfully:', userType);
        return {
          token: data.token,
          refresh_token: data.refresh_token,
          user_id: data.user_id,
          user_type: data.user_type,
        };
      }

      throw new Error("Incomplete data received from server.");

    } catch (error) {
      console.log('Login error caught:', error);
      console.log('Error response:', error.response);
      console.log('Error isPending:', error.isPending);
      console.log('Error userId:', error.userId);
      
      // Handle server error responses
      if (error.response) {
        const { status, data } = error.response;
        console.log('Error status:', status);
        console.log('Error data:', data);

        switch (status) {
          case 400:
            throw new Error(data.error || "Credentials are missing.");
          
          case 401:
            throw new Error(data.error || "Credentials are incorrect.");

          case 403:
            if (data.error_code === 'ACCOUNT_PENDING') {
              const pendingError = new Error(data.error || "Change your password to activate your account.");
              pendingError.isPending = true;
              pendingError.userId = identifier;
              console.log('Created pending error:', pendingError);
              throw pendingError;
            }
            if (data.error_code === 'ACCOUNT_INACTIVE_OR_SUSPENDED') {
              throw new Error(data.error || "Account is inactive or suspended.");
            }
            throw new Error(data.error || "Access forbidden.");

          case 404:
            throw new Error(data.error || "User not found.");

          default:
            throw new Error(data.error || "An unexpected error occurred. Please try again.");
        }
      }

      // Re-throw if it's already an Error (like our validation error)
      if (error instanceof Error) {
        throw error;
      }

      // Network error or other errors
      throw new Error(error.message || "Network error. Check your connection.");
    }
  },

  // LOGIN WITH TOKEN - Auto-login for "Keep Login"
  async loginWithToken(user_id, token, refresh_token, device_info) {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.LOGIN_WITH_TOKEN, {
        user_id,
        token,
        refresh_token,
        device_info,
      });

      const data = response;

      // Validate response has required fields
      if (data.token && data.refresh_token && data.user_id) {
        return {
          token: data.token,
          refresh_token: data.refresh_token,
          user_id: data.user_id,
        };
      }

      throw new Error("Incomplete token data received.");

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            throw new Error(data.error_code || "Invalid token. Please login again.");
          
          case 403:
            throw new Error(data.error || "Account is inactive or suspended.");

          case 406:
            throw new Error(data.error || "Token or user_id is missing.");

          default:
            throw new Error(data.error || "Token validation failed.");
        }
      }

      throw new Error(error.message || "Network error. Check your connection.");
    }
  },


  // SAVE AUTH DATA - Store tokens after login
  saveAuthData(data, rememberMe, device_info) {
    const authData = {
      token: data.token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      user_type: data.user_type,
      is_admin: true,
      device_info: device_info || '',
      loginTime: new Date().toISOString(),
    };

    if (rememberMe) {
      localStorage.setItem('authData', JSON.stringify(authData));
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('authData', JSON.stringify(authData));
      localStorage.removeItem('rememberMe');
    }
  },

  // GET AUTH DATA - Retrieve stored authentication data
  getAuthData() {
    const stored = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    return stored ? JSON.parse(stored) : null;
  },

  // CHECK IF AUTHENTICATED
  isAuthenticated() {
    const authData = this.getAuthData();
    return !!(authData && authData.token && authData.user_id);
  },

  // LOGOUT - Clear all saved data
  logout() {
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    localStorage.removeItem('lastLogin');
  },

    // CHANGE PASSWORD - For pending account activation
    async changePassword(user_id, old_password, new_password) {
    try {
      // Ensure the payload matches Django's request.data.get() keys exactly
      const response = await axiosClient.post(API_ENDPOINTS.LOGIN_CHANGE_PASSWORD, {
        user_id,      // Matches request.data.get('user_id')
        old_password,  // Matches request.data.get('old_password')
        new_password,  // Matches request.data.get('new_password')
      });
    
      return response; 
    } catch (error) {
      if (error.response) {
        // Django returns { "error": "..." }
        throw new Error(error.response.data.error || "Failed to change password.");
      }
      throw new Error("Network error. Please try again later.");
    }
  },

  // GET ERROR MESSAGE - Convert error to readable text
  // authService.js
getErrorMessage: (error) => {
  // If it's a manual 'throw new Error("msg")' from your switch case
  if (error instanceof Error && !error.response) {
    return error.message;
  }

  // If it's a raw Axios error that escaped the switch case
  const serverData = error.response?.data;
  
  // Use 'error_code' to match your Django server's response keys
  if (serverData?.error_code === 'ACCOUNT_PENDING') {
    return serverData.error || "Account pending activation.";
  }

  return serverData?.error || error.message || "An unexpected error occurred.";
},
};  