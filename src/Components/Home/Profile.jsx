import { useState, useEffect } from 'react';

const Profile = ({ onLogout }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState('admin@farmo.com');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', password: '', profilePicture: null });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordMethod, setPasswordMethod] = useState('current');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '', otp: '', identifier: '' });
  const [passwordStep, setPasswordStep] = useState(1);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    if (authData) {
      setAdminInfo(JSON.parse(authData));
    }

    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin) {
      setLoginInfo(JSON.parse(lastLogin));
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setAdmins(users.filter(u => u.isAdmin === 'Yes' && u.userType !== 'Farmer' && u.userType !== 'Consumer'));
  }, []);

  const switchAdmin = (admin) => {
    const authData = {
      token: 'mock_token_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      user_id: admin.userId || admin.id,
      email: admin.email || admin.userId,
      is_admin: true,
      loginTime: new Date().toISOString(),
    };
    
    const storage = localStorage.getItem('authData') ? localStorage : sessionStorage;
    storage.setItem('authData', JSON.stringify(authData));
    
    alert(`Switched to ${admin.firstName} ${admin.lastName}`);
    window.location.reload();
  };

  const switchToSuperAdmin = () => {
    const authData = {
      token: 'mock_token_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      user_id: 'ADM001',
      email: 'admin@farmo.com',
      is_admin: true,
      loginTime: new Date().toISOString(),
    };
    
    const storage = localStorage.getItem('authData') ? localStorage : sessionStorage;
    storage.setItem('authData', JSON.stringify(authData));
    
    alert('Switched to Super Admin');
    window.location.reload();
  };

  const deleteAdmin = (adminId) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updated = users.filter(u => u.id !== adminId);
      localStorage.setItem('users', JSON.stringify(updated));
      setAdmins(updated.filter(u => u.isAdmin === 'Yes' && u.userType !== 'Farmer' && u.userType !== 'Consumer'));
      alert('Admin deleted successfully');
    }
  };

  const handleEditProfile = () => {
    const savedName = localStorage.getItem('adminName') || 'Administrator';
    setEditData({ name: savedName, password: '', profilePicture: null });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('adminName', editData.name);
    if (editData.profilePicture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem('adminProfilePic', e.target.result);
        alert('Profile updated successfully');
        setIsEditing(false);
        window.location.reload();
      };
      reader.readAsDataURL(editData.profilePicture);
    } else {
      alert('Profile updated successfully');
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleChangePassword = () => {
    setPasswordData({ current: '', new: '', confirm: '', otp: '', identifier: '' });
    setPasswordMethod('current');
    setPasswordStep(1);
    setPasswordMessage('');
    setShowChangePassword(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordMethod === 'current') {
      if (!passwordData.new || !passwordData.confirm) {
        setPasswordMessage('Please fill all fields');
        return;
      }
      if (passwordData.new !== passwordData.confirm) {
        setPasswordMessage('Passwords do not match');
        return;
      }
      alert('Password changed successfully');
      setShowChangePassword(false);
    } else {
      if (passwordStep === 1) {
        setPasswordMessage('OTP sent to your email/phone');
        setPasswordStep(2);
      } else if (passwordStep === 2) {
        if (!passwordData.otp) {
          setPasswordMessage('Please enter OTP');
          return;
        }
        setPasswordMessage('OTP verified');
        setPasswordStep(3);
      } else {
        if (passwordData.new !== passwordData.confirm) {
          setPasswordMessage('Passwords do not match');
          return;
        }
        alert('Password changed successfully');
        setShowChangePassword(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
      
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <img src={localStorage.getItem('adminProfilePic') || 'admin.png'} alt="Admin Profile" className="w-24 h-24 rounded-full object-cover border-2 border-green-500" />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{localStorage.getItem('adminName') || 'Administrator'}</h3>
            <p className="text-gray-600">{adminInfo?.email}</p>
            <div className="flex items-center gap-3">
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleEditProfile} className="flex px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition text-sm font-medium">
          Edit Profile
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditData({ ...editData, profilePicture: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveProfile} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{adminInfo?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Role:</span>
            <span className="text-gray-800">Administrator</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Account Status:</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 font-medium">Login Time:</span>
            <span className="text-gray-800">
              {adminInfo?.loginTime ? new Date(adminInfo.loginTime).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Last Login Information */}
      {loginInfo && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Last Login Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Device</p>
              <p className="text-lg font-semibold text-gray-800">{loginInfo.device}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Browser</p>
              <p className="text-lg font-semibold text-gray-800">{loginInfo.browser}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-lg font-semibold text-gray-800">{loginInfo.time}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">IP Address</p>
              <p className="text-lg font-semibold text-gray-800">{loginInfo.ip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Management */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Management</h3>
        {admins.length > 0 ? (
          <div className="space-y-3">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{admin.firstName} {admin.lastName}</p>
                  <p className="text-sm text-gray-600">{admin.email || admin.userId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => switchAdmin(admin)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Switch
                  </button>
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No secondary admins registered</p>
        )}
        {adminInfo?.user_id !== 'ADM001' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Super Admin</p>
              <p className="text-sm text-blue-700">admin@farmo.com</p>
            </div>
            <button
              onClick={switchToSuperAdmin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Switch to Super Admin
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4"></h3>
        <div className="flex gap-4">
          <button onClick={handleChangePassword} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Change Password
          </button>
          <button 
            onClick={onLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            
            {passwordMethod === 'current' ? (
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {passwordMessage && <p className="text-sm text-red-600">{passwordMessage}</p>}
                <button onClick={handlePasswordSubmit} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Change Password
                </button>
                <button onClick={() => setPasswordMethod('otp')} className="w-full py-2 text-blue-600 hover:underline text-sm">
                  Try a different way
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {passwordStep === 1 && (
                  <>
                    <input
                      type="text"
                      placeholder="Email or Phone"
                      value={passwordData.identifier}
                      onChange={(e) => setPasswordData({ ...passwordData, identifier: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
                    <button onClick={handlePasswordSubmit} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Send OTP
                    </button>
                  </>
                )}
                {passwordStep === 2 && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={passwordData.otp}
                      onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      maxLength="6"
                    />
                    {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
                    <button onClick={handlePasswordSubmit} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Verify OTP
                    </button>
                  </>
                )}
                {passwordStep === 3 && (
                  <>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {passwordMessage && <p className="text-sm text-red-600">{passwordMessage}</p>}
                    <button onClick={handlePasswordSubmit} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Change Password
                    </button>
                  </>
                )}
                <button onClick={() => { setPasswordMethod('current'); setPasswordStep(1); setPasswordMessage(''); }} className="w-full py-2 text-blue-600 hover:underline text-sm">
                  Use current password instead
                </button>
              </div>
            )}
            <button onClick={() => setShowChangePassword(false)} className="w-full mt-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
