import { useState, useEffect } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otpExpiry && step === 2) {
      const checkExpiry = setInterval(() => {
        if (Date.now() > otpExpiry) {
          setError('OTP expired. Please request a new one.');
          setStep(1);
        }
      }, 1000);
      return () => clearInterval(checkExpiry);
    }
  }, [otpExpiry, step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Mock mode - remove this block when backend is ready
    setStep(2);
    setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes
    setResendTimer(60); // 60 seconds cooldown
    setAttempts(0);
    setSuccess('OTP sent to ' + identifier + ' (Demo: use 123456, expires in 5 min)');
    return;
    // Uncomment below when backend is ready
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setSuccess('OTP sent successfully');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    */
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (attempts >= 3) {
      setError('Too many attempts. Please request a new OTP.');
      setStep(1);
      return;
    }
    
    // Mock mode - remove this block when backend is ready
    if (otp === '123456') {
      setStep(3);
      setSuccess('OTP verified');
    } else {
      setAttempts(attempts + 1);
      setError(`Invalid OTP. ${3 - attempts - 1} attempts remaining. Use 123456 for demo`);
    }
    return;
    // Uncomment below when backend is ready
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(3);
        setSuccess('OTP verified');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    */
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    // Mock mode - remove this block when backend is ready
    setSuccess('Password reset successful (Demo mode)');
    return;
    // Uncomment below when backend is ready
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Password reset successful');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-800">Farmo</h2>
          <p className="text-gray-600 mt-2">Reset Your Password</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email or Phone</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter your email or phone"
                required
              />
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-750 hover:to-green-800 transition">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
            </div>
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">{success}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-750 hover:to-green-800 transition">
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
              className="w-full py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter new password"
                required
              />
            </div>
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">{success}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:from-green-750 hover:to-green-800 transition">
              Reset Password
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
