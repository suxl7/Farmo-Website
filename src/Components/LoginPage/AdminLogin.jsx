import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(true);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser';
    const device = /mobile/i.test(ua) ? 'Mobile' : /tablet/i.test(ua) ? 'Tablet' : 'Desktop';
    return `${device} - ${browser}`;
  };

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const rememberMeEnabled = localStorage.getItem('rememberMe') === 'true';
      const authData = authService.getAuthData();

      if (rememberMeEnabled && authData?.token && authData?.user_id && authData?.refresh_token) {
        try {
          const data = await authService.loginWithToken(
            authData.user_id,
            authData.token,
            authData.refresh_token,
            authData.device_info || getDeviceInfo()
          );
          
          authService.saveAuthData(data, true, authData.device_info || getDeviceInfo());
          
          if (onLoginSuccess) onLoginSuccess();
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Auto-login failed:', err);
          authService.logout();
          setIsAutoLogging(false);
        }
      } else {
        setIsAutoLogging(false);
      }
    };

    attemptAutoLogin();
  }, [navigate, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const deviceInfo = getDeviceInfo();
      const data = await authService.login(identifier, password, true, deviceInfo);
      authService.saveAuthData(data, rememberMe, deviceInfo);
      
      if (onLoginSuccess) onLoginSuccess();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error in component:', err);
      if (err.isPending) {
        navigate('/change-password', { 
          state: { userId: err.userId, oldPassword: password },
          replace: true 
        });
      } else {
        setError(err.message || 'Invalid username or password. Please try again.');
      }
    }
  };

  if (isAutoLogging) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex items-center justify-center">
        <div className="text-white text-xl">Logging in...</div>
      </div>
    );
  }

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
            <label className="block text-gray-700 font-medium mb-2">Username or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              placeholder="Enter your username or phone"
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
              <span className="ml-2 text-sm text-gray-700">Keep Login</span>
            </label>
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
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
    </div>
  );
};

export default AdminLogin;
