// API Configuration for Farmo Backend
export const API_BASE_URL = 'https://api.farmo.com'; // Replace with actual API URL

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login/',
  LOGIN_WITH_TOKEN: '/api/auth/login-with-token/',
  REGISTER: '/api/auth/register/',
  CHECK_USERID: '/api/auth/check-userid/',
};

export const ERROR_MESSAGES = {
  MISSING_CREDENTIALS: 'Please enter both email and password',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_PENDING: 'Your account is pending activation. Please change your password.',
  ACCOUNT_INACTIVE: 'Your account has been suspended. Contact admin.',
  MISSING_TOKENS_OR_USERID: 'Session expired. Please login again.',
  INVALID_TOKEN: 'Session expired. Please login again.',
  MISSING_REQUIRED_FIELDS: 'Please fill all required fields',
  USERID_EXISTS: 'User ID already exists',
  INSUFFICIENT_PRIVILEGES: 'You do not have permission to create this user type',
  PHONE_NUMBER_ACCOUNT_LIMIT_REACHED: 'Phone number has reached account limit (max 3)',
  PHONE_EXISTS_ACTIVE_ACCOUNT: 'Phone number already linked to an active account',
  PROFILE_PICTURE_UPLOAD_FAILED: 'Failed to upload profile picture',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export const USER_TYPES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  FARMER: 'Farmer',
  CONSUMER: 'Consumer',
};

export const PROFILE_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
};
