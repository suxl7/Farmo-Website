// API Configuration for Farmo Backend
export const API_BASE_URL = 'https://footsore-nana-dieretic.ngrok-free.dev'; // Replace with actual API URL
//export const API_BASE_URL = 'http://192.168.1.179:8000'
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login/', // Endpoint for user login
  LOGIN_WITH_TOKEN: '/api/auth/login-with-token/', // Endpoint for token-based login
  REGISTER: '/api/auth/register/',  // Endpoint for user registration
  CHECK_USERID: '/api/auth/check-userid/', // Endpoint to check if a user ID exists
  USERS: '/api/users',
  
  LOGIN_CHANGE_PASSWORD: '/api/auth/login-change-password/',// Endpoint for changing password on first login
  FORGOT_PASSWORD: '/api/auth/forgot-password/',  // Endpoint to initiate forgot password process
  FORGOT_PASSWORD_VERIFY_EMAIL: '/api/auth/forgot-password-verify-email/',
  FORGOT_PASSWORD_VERIFY_OTP: '/api/auth/forgot-password-verify-otp/',
  FORGOT_PASSWORD_CHANGE_PASSWORD: '/api/auth/forgot-password-change-password/',
  DASHBOARD: '/api/home/dashboard/', // API endpoint for dashboard data
  FARMER_STATS: '/api/farmers/stats/',  // API endpoint for fetching farmer statistics
  CONSUMERS_STATS: '/api/consumers/stats/',   // API endpoint for fetching consumer statistics
  LOGOUT: '/api/auth/logout/', // API endpoint for logging out
  LOGOUT_ALL: '/api/auth/logout-all/', // API endpoint for logging out from all sessions
  
  CHANGE_PASSWORD: '/api/user/change-password/', //API endpoint for Admin password change
  PROFILE: '/api/profile/', 
  FARMERS: '/api/admin/farmer/',  // API endpoint for farmers list and details
  CONSUMERS: '/api/admin/consumer/', // API endpoint for consumers list and details
  ADMINS: '/api/admin/admin-page/', // API endpoint for admin stats
  ADMIN_LIST: '/api/admin/admin-list/', // API endpoint for admin list
  USER_PROFILE: '/api/admin/view-user-profile/', //API endpoint for user profile details (Farmer/Consumer)
  USER_SEARCH: '/api/admin/search-user/',  // API endpoint for user search
  ACTION_STATUS: '/api/admin/action-status-action/', // API endpoint for user status actions (suspend/activate/deactivate)
  OWN_PROFILE: '/api/user/view-profile/', // API endpoint for fetching own profile details
  ADD_PRODUCT: '/api/product/add/',
  FILE_DOWNLOAD: '/api/file/download/', // API endpoint for file download
  FILE_UPLOAD: '/api/file/upload/', // API endpoint for file upload
  ADDRESS: '/api/user/address/', // API endpoint for managing addresses
  CHECK_PASSWORD: '/api/user/check-password/', // API endpoint for password verification
  UPDATE_USER_PROFILE: '/api/user/user-profile/update/',
  UPDATE_PROFILE: '/api/user/update-profile/', // API endpoint for updating user profiles
  UPDATE_ADMIN_PROFILE: '/api/admin/update-user-profile/', // API endpoint for admin updating user profiles
  PRODUCT_FILTER: '/api/product/filter/', // API endpoint for filtering products
  PRODUCT_STATS: '/api/admin/product/', // API endpoint for product statistics
  GENERATE_REPORT: '/api/reports/generate/', // API endpoint for generating reports
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

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Invalid credentials',
  NETWORK_ERROR: 'Network error occurred',
  INVALID_TOKEN: 'You session has expired. Please log in again.',
  REQUEST_FAILED: 'Request failed',
};
