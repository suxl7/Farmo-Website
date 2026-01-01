import { API_BASE_URL } from '../config/api';

const USE_MOCK = true; // Set to false when backend is ready

class ApiClient {
  async request(endpoint, options = {}) {
    if (USE_MOCK) {
      return this.mockRequest(endpoint, options);
    }

    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        await this.refreshToken();
        return this.request(endpoint, options);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('NETWORK_ERROR');
    }
  }

  getToken() {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    return authData ? JSON.parse(authData).token : null;
  }

  async refreshToken() {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    if (!authData) throw new Error('INVALID_TOKEN');

    const { refresh_token, user_id, is_admin } = JSON.parse(authData);
    const data = await this.request('/api/auth/login-with-token/', {
      method: 'POST',
      body: JSON.stringify({ user_id, token: this.getToken(), refresh_token, is_admin }),
    });

    if (data.login_access) {
      const newAuthData = { token: data.token, refresh_token: data.refresh_token, user_id: data.user_id, is_admin };
      if (localStorage.getItem('authData')) localStorage.setItem('authData', JSON.stringify(newAuthData));
      else sessionStorage.setItem('authData', JSON.stringify(newAuthData));
    }
  }

  mockRequest(endpoint, options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, mock: true });
      }, 300);
    });
  }
}

export default new ApiClient();
