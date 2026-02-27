import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, oldPassword } = location.state || {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const newPasswordRef = useRef(null);

  useEffect(() => {
    if (!userId || !oldPassword) {
      navigate('/login', { replace: true });
      return;
    }
    newPasswordRef.current?.focus();
  }, [userId, oldPassword, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }
    
    try {
      authService.changePassword(userId, oldPassword, newPassword);
      setMessage('Password changed successfully! Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setMessage(err.message || 'Failed to change password');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex items-center justify-center p-4" style={{ backgroundImage: 'url(/top-view-transparent-leaf-with-copy-space.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/30">
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <img src="/farmo-1.png" alt="Farmo Logo" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 text-center">Reset Password</h2>
          <p className="text-gray-600 text-center mt-2">Please change your password to activate your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                ref={newPasswordRef}
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img src={showNewPassword ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img src={showConfirmPassword ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`px-4 py-3 rounded-lg ${isSuccess ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-750 hover:to-green-800 transform hover:scale-105 transition duration-200 shadow-lg"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
