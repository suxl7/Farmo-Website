import apiClient from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';

const USE_MOCK = true;

export const userService = {
  async getUsers(userType = null) {
    if (USE_MOCK) {
      return this.mockGetUsers(userType);
    }

    const endpoint = userType ? `${API_ENDPOINTS.USERS}?user_type=${userType}` : API_ENDPOINTS.USERS;
    return await apiClient.request(endpoint);
  },

  async createUser(userData) {
    if (USE_MOCK) {
      return this.mockCreateUser(userData);
    }

    return await apiClient.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUser(userId, userData) {
    if (USE_MOCK) {
      return this.mockUpdateUser(userId, userData);
    }

    return await apiClient.request(`${API_ENDPOINTS.USERS}/${userId}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(userId) {
    if (USE_MOCK) {
      return this.mockDeleteUser(userId);
    }

    return await apiClient.request(`${API_ENDPOINTS.USERS}/${userId}/`, {
      method: 'DELETE',
    });
  },

  async checkUserIdAvailability(userId) {
    if (USE_MOCK) {
      return this.mockCheckUserId(userId);
    }

    return await apiClient.request(API_ENDPOINTS.CHECK_USERID, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  // Mock implementations
  mockGetUsers(userType) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return userType ? users.filter(u => u.userType === userType) : users;
  },

  mockCreateUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      ...userData,
      id: `${userData.userType[0]}${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: userData.status || 'Active',
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { registration_successful: true, user: newUser };
  },

  mockUpdateUser(userId, userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u => (u.id === userId ? { ...u, ...userData } : u));
    localStorage.setItem('users', JSON.stringify(updated));
    return { success: true };
  },

  mockDeleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filtered));
    return { success: true };
  },

  mockCheckUserId(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.some(u => u.userId === userId);
    return { status: exists ? 1 : 0 };
  },
};
