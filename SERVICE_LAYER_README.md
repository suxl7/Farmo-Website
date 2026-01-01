# Farmo Service Layer Architecture

## Structure
```
src/
├── config/
│   └── api.js              # API endpoints & constants
├── utils/
│   └── apiClient.js        # HTTP client with token management
├── services/
│   ├── index.js            # Export all services
│   ├── authService.js      # Authentication operations
│   └── userService.js      # User CRUD operations
└── Components/             # React components use services
```

## How It Works

### 1. Components call Services
```javascript
// In any component
import { authService, userService } from '../../services';

// Login
const data = await authService.login(email, password, true, deviceInfo);

// Get users
const farmers = await userService.getUsers('Farmer');

// Create user
await userService.createUser(userData);
```

### 2. Services handle Mock vs Real API
```javascript
// In authService.js
const USE_MOCK = true; // Change to false when backend ready

if (USE_MOCK) {
  return this.mockLogin(identifier, password); // Uses localStorage
}
return await apiClient.request('/api/auth/login/', {...}); // Calls real API
```

### 3. API Client manages tokens automatically
- Adds Authorization header to all requests
- Refreshes expired tokens automatically
- Handles network errors

## Switching to Real Backend

**Step 1:** Update API base URL
```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:8000'; // Django backend URL
```

**Step 2:** Disable mock mode
```javascript
// src/services/authService.js
const USE_MOCK = false;

// src/services/userService.js
const USE_MOCK = false;

// src/utils/apiClient.js
const USE_MOCK = false;
```

**That's it!** All components automatically use real backend.

## Benefits
✅ Change 3 lines to switch from mock to real backend
✅ All API calls in one place
✅ Automatic token management
✅ Consistent error handling
✅ Easy to test and maintain
