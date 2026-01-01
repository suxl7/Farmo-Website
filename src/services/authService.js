import apiClient from '../utils/apiClient';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../config/api';

const USE_MOCK = true;

export const authService = {
  async login(identifier, password, is_admin, device_info) {
    if (USE_MOCK) {
      return this.mockLogin(identifier, password);
    }

    const data = await apiClient.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ identifier, password, is_admin, device_info }),
    });

    if (!data.login_access) {
      throw new Error(data.error_code || 'LOGIN_FAILED');
    }

    return data;
  },

  async loginWithToken(user_id, token, refresh_token, is_admin, device_info) {
    if (USE_MOCK) {
      return { login_access: true, token, refresh_token, user_id };
    }

    const data = await apiClient.request(API_ENDPOINTS.LOGIN_WITH_TOKEN, {
      method: 'POST',
      body: JSON.stringify({ user_id, token, refresh_token, is_admin, device_info }),
    });

    return data;
  },

  mockLogin(identifier, password) {
    const DEFAULT_EMAIL = 'admin@farmo.com';
    const DEFAULT_PASSWORD = 'admin123';

    if (identifier === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      return {
        login_access: true,
        token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user_id: 'ADM001',
        email: DEFAULT_EMAIL,
      };
    }

    // Check registered admins from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const admin = users.find(u => 
      u.isAdmin === 'Yes' && 
      u.userType !== 'Farmer' && 
      u.userType !== 'Consumer' &&
      (u.email === identifier || u.userId === identifier || u.mobileNumber === identifier) && 
      u.password === password
    );

    if (admin) {
      return {
        login_access: true,
        token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user_id: admin.userId || admin.id,
        email: admin.email || admin.userId,
      };
    }

    throw new Error('INVALID_CREDENTIALS');
  },

  saveAuthData(data, rememberMe) {
    const authData = {
      token: data.token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      email: data.email || data.identifier,
      is_admin: true,
      loginTime: new Date().toISOString(),
    };

    if (rememberMe) {
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      sessionStorage.setItem('authData', JSON.stringify(authData));
    }
  },

  logout() {
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    localStorage.removeItem('lastLogin');
  },

  getErrorMessage(errorCode) {
    return ERROR_MESSAGES[errorCode] || 'An error occurred';
  },
};
