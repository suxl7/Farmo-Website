# AXIOS IMPLEMENTATION GUIDE - Easy to Understand

## What is Axios?
Axios is a tool that helps your React app talk to the backend server. Think of it as a **messenger** that carries data back and forth.

---

## Why Axios is Better than Fetch?

### Fetch (Old Way):
```javascript
const response = await fetch('http://api.com/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

if (!response.ok) throw new Error('Failed');
const data = await response.json(); // Manual JSON parsing
```

### Axios (New Way):
```javascript
const data = await axios.post('http://api.com/login', {
  username,
  password
});
// That's it! Axios handles everything automatically
```

---

## How It Works (Simple Explanation)

### 1. **axiosClient.js** - The Messenger
This file creates a "messenger" that:
- Knows the backend URL (so you don't repeat it)
- Automatically adds your login token to every request
- Handles errors automatically
- Refreshes expired tokens

**Think of it as:** A mail carrier who knows your address and always carries your ID.

### 2. **authServiceAxios.js** - The Authentication Manager
This file handles:
- Login (send username/password, get token)
- Save tokens (remember user is logged in)
- Logout (forget user)
- Auto-login (use saved token)

**Think of it as:** A security guard managing who can enter.

---

## File Structure

```
src/
├── utils/
│   ├── axiosClient.js       ← The messenger (handles all requests)
│   └── apiClient.js         ← Old version (using fetch)
├── services/
│   ├── authServiceAxios.js  ← New auth service (using axios)
│   └── authService.js       ← Old auth service (using fetch)
└── config/
    └── api.js               ← API URLs and settings
```

---

## How to Use Axios in Your Components

### Example 1: Login Component
```javascript
import { authServiceAxios } from '../services/authServiceAxios';

const handleLogin = async () => {
  try {
    // Call login function
    const result = await authServiceAxios.login(
      username,      // user's email/phone
      password,      // user's password
      true,          // is admin?
      deviceInfo     // device details
    );

    // Save tokens
    authServiceAxios.saveAuthData(result, rememberMe);

    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
};
```

### Example 2: Fetch Users
```javascript
import axiosClient from '../utils/axiosClient';

const getUsers = async () => {
  try {
    const users = await axiosClient.get('/api/users');
    console.log(users);
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
  }
};
```

### Example 3: Add New User
```javascript
import axiosClient from '../utils/axiosClient';

const addUser = async (userData) => {
  try {
    const result = await axiosClient.post('/api/users', userData);
    alert('User added successfully!');
  } catch (error) {
    alert('Failed to add user: ' + error.message);
  }
};
```

---

## Key Concepts Explained

### 1. **Interceptors** (Request & Response)
**Request Interceptor:** Runs BEFORE sending request
- Adds token to every request automatically
- Like a security guard checking your ID before you enter

**Response Interceptor:** Runs AFTER receiving response
- Checks if token expired (401 error)
- Automatically refreshes token and retries
- Like a receptionist who renews your expired pass

### 2. **Token Refresh**
When your token expires:
1. Server returns 401 error
2. Axios catches it
3. Calls refresh token API
4. Gets new token
5. Retries original request
6. You don't even notice!

### 3. **localStorage vs sessionStorage**
- **localStorage:** Stays forever (even after closing browser)
  - Use for "Remember Me" feature
- **sessionStorage:** Clears when browser closes
  - Use for normal login

---

## Installation

To use axios, install it first:
```bash
npm install axios
```

---

## Migration Steps (From Fetch to Axios)

### Step 1: Install axios
```bash
npm install axios
```

### Step 2: Replace imports in your components
```javascript
// OLD
import { authService } from './services/authService';

// NEW
import { authServiceAxios } from './services/authServiceAxios';
```

### Step 3: Update API calls
```javascript
// OLD
const data = await apiClient.request('/api/users', { method: 'GET' });

// NEW
const data = await axiosClient.get('/api/users');
```

---

## Common Axios Methods

```javascript
// GET - Fetch data
await axiosClient.get('/api/users');

// POST - Create new data
await axiosClient.post('/api/users', { name: 'John' });

// PUT - Update existing data
await axiosClient.put('/api/users/123', { name: 'Jane' });

// DELETE - Remove data
await axiosClient.delete('/api/users/123');
```

---

## Error Handling

```javascript
try {
  const data = await axiosClient.get('/api/users');
  console.log(data);
} catch (error) {
  // error.message contains the error text
  console.error('Error:', error.message);
  
  // Show user-friendly message
  alert('Failed to load users. Please try again.');
}
```

---

## Summary

**Axios makes your life easier by:**
1. ✅ Less code to write
2. ✅ Automatic JSON handling
3. ✅ Automatic token management
4. ✅ Automatic error handling
5. ✅ Automatic token refresh
6. ✅ Cleaner, more readable code

**You just focus on:** What data to send/receive, axios handles the rest!
