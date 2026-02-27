import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';   

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [userId, setUserId] = useState('');
  const [halfEmail, setHalfEmail] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Request Reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`, { identifier });
      setUserId(res.data.user_id);
      setHalfEmail(res.data.half_email);
      setMessage(`Email hint: ${res.data.half_email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'User not found');
    }
  };

  // Step 2: Verify Email & Send OTP
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD_VERIFY_EMAIL}`, { user_id: userId, email });
      setMessage('OTP sent to your email!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email');
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD_VERIFY_OTP}`, { user_id: userId, otp });
      setMessage('OTP verified! Set new password');
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  // Step 4: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD_CHANGE_PASSWORD}`, { user_id: userId, password });
      setMessage('Password changed successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex items-center justify-center p-4" 
         style={{ backgroundImage: 'url(/top-view-transparent-leaf-with-copy-space.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/30">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/farmo-1.png" alt="Farmo Logo" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-green-600">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-1">Step {step} of 4</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className={`w-1/4 h-2 rounded-full mx-1 ${
                step >= num ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            ))}
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Enter Identifier */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">User ID or Phone</label>
              <input
                type="text"
                placeholder="Enter your User ID or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-700 transition shadow-lg"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Verify Email */}
        {step === 2 && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Email Hint:</span> {halfEmail}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Email Address</label>
              <input
                type="email"
                placeholder="Enter your complete email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-700 transition shadow-lg"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 3: Verify OTP */}
        {step === 3 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-600 mt-2">Check your email for the OTP code</p>
            </div>
            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-700 transition shadow-lg"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 4: Reset Password */}
        {step === 4 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
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
            {password && confirmPassword && (
              <p className={`text-sm ${
                password === confirmPassword ? 'text-green-600' : 'text-red-600'
              }`}>
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
            <button 
              type="submit" 
              disabled={password !== confirmPassword}
              className={`w-full px-6 py-3 font-bold rounded-lg transition shadow-lg ${
                password === confirmPassword
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;