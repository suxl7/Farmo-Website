import { useState, useEffect } from 'react';
import { authService } from '../../services';

const AdminLogin = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetMessage, setResetMessage] = useState('');

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
      ip: 'Local',
      showNotification: true
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

    const device_info = `${getDeviceModel()} ${getBrowserInfo()}`;

    try {
      const data = await authService.login(identifier, password, true, device_info);
      authService.saveAuthData(data, rememberMe);
      showLoginNotification();
      if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(authService.getErrorMessage(err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex items-center justify-center p-4" style={{ backgroundImage: 'url(/top-view-transparent-leaf-with-copy-space.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/30">
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
                <img src={showPassword ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
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
            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Forgot Password?
            </button>
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

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
              <button onClick={() => { setShowForgotPassword(false); setResetStep(1); setResetMessage(''); }} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>

            {resetStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Enter your email or phone number to receive OTP</p>
                <input
                  type="text"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Email or Phone"
                />
                {resetMessage && <p className="text-sm text-green-600">{resetMessage}</p>}
                <button onClick={() => { setResetMessage('OTP sent to your email/phone'); setResetStep(2); }} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send OTP
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Enter the OTP sent to {resetIdentifier}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter OTP"
                  maxLength="6"
                />
                {resetMessage && <p className={`text-sm ${resetMessage.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>{resetMessage}</p>}
                <button onClick={() => { if (!otp) { setResetMessage('Please enter OTP'); return; } setResetMessage('OTP verified successfully'); setResetStep(3); }} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Verify OTP
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Create your new password</p>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showNewPassword ? "/show.png" : "/delete.png"} alt="toggle" className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showConfirmPassword ? "/show.png" : "/delete.png"} alt="toggle" className="w-4 h-4" />
                  </button>
                </div>
                {resetMessage && <p className={`text-sm ${resetMessage.includes('not match') ? 'text-red-600' : 'text-green-600'}`}>{resetMessage}</p>}
                <button onClick={() => { if (newPassword !== confirmPassword) { setResetMessage('Passwords do not match'); return; } setResetMessage('Password reset successful!'); setTimeout(() => { setShowForgotPassword(false); setResetStep(1); setResetMessage(''); }, 2000); }} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
      const loginData = JSON.parse(info);
      if (loginData.showNotification) {
        setLoginInfo(loginData);
        setShow(true);
        setTimeout(() => setShow(false), 5000);
        // Remove flag after showing
        delete loginData.showNotification;
        localStorage.setItem('lastLogin', JSON.stringify(loginData));
      }
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
