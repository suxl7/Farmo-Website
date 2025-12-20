import { useState, useEffect } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Default credentials
  const DEFAULT_EMAIL = 'admin@farmo.com';
  const DEFAULT_PASSWORD = 'admin123';

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    return browser;
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
  };

  const getDeviceModel = () => {
    const ua = navigator.userAgent;
    
    // Android - extract model from Build/ or after Android
    if (/Android/.test(ua)) {
      const buildMatch = ua.match(/Build\/[^;)]+;\s*([^)]+)/);
      const modelMatch = ua.match(/;\s*([^;)]+)\s+Build/);
      if (modelMatch) return modelMatch[1].trim();
      if (buildMatch) return buildMatch[1].trim();
      return 'Android Device';
    }
    
    // iPhone - extract model
    if (/iPhone/.test(ua)) {
      const match = ua.match(/iPhone(\d+,\d+)?/);
      return match ? match[0] : 'iPhone';
    }
    
    // iPad
    if (/iPad/.test(ua)) return 'iPad';
    
    // Windows
    if (/Windows/.test(ua)) return 'Windows PC';
    
    // Mac
    if (/Macintosh/.test(ua)) return 'Mac';
    
    return 'Unknown Device';
  };

  const showLoginNotification = () => {
    const browser = getBrowserInfo();
    const device = getDeviceInfo();
    const deviceModel = getDeviceModel();
    const time = new Date().toLocaleString();
    const loginInfo = {
      browser,
      device,
      deviceModel,
      time,
      ip: 'Local'
    };
    
    localStorage.setItem('lastLogin', JSON.stringify(loginInfo));
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Login Successful', {
        body: `Logged in from ${deviceModel} using ${browser}`,
        icon: '/FarmO-L.png'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check default credentials
    if (identifier === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      // Store auth data
      const authData = {
        email: DEFAULT_EMAIL,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      if (rememberMe) {
        localStorage.setItem('authData', JSON.stringify(authData));
      } else {
        sessionStorage.setItem('authData', JSON.stringify(authData));
      }

      // Show login notification
      showLoginNotification();

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Redirect to dashboard
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-100 to-slate-400 rounded-xl  shadow-2xl p-8 w-full max-w-md">
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <img src="/farmo-1.png" alt="Farmo Logo" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 text-left">Welcome Back,</h2>
          <p className="text-gray-600 text-left">Please login to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email or Phone</label>
            <input
              type="varchar"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              placeholder="Enter your email or phone"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter your password"
                style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                autoComplete="off"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img src={showPassword ? "/show.png" : "/close.png"} alt="toggle" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember Me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Forgot Password?
            </a>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-750 hover:to-green-800 transform hover:scale-105 transition duration-200 shadow-lg"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

// Notification component to show login info
export const LoginNotification = () => {
  const [loginInfo, setLoginInfo] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem('lastLogin');
    if (info) {
      setLoginInfo(JSON.parse(info));
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  }, []);

  if (!show || !loginInfo) return null;

  return (
    <div className="fixed top-20 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-sm z-[9999] border-2 border-green-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-gray-900">Login Successful</p>
          <p className="mt-1 text-sm text-gray-600">Device: {loginInfo.device}</p>
          <p className="text-sm text-gray-600">{loginInfo.deviceModel}</p>
          <p className="text-sm text-gray-600">Browser: {loginInfo.browser}</p>
          <p className="text-sm text-gray-600">Time: {loginInfo.time}</p>
        </div>
        <button onClick={() => setShow(false)} className="ml-4 flex-shrink-0">
          <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
        </button>
      </div>
    </div>
  );
};
