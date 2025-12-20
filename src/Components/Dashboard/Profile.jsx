import { useState, useEffect } from 'react';

const Profile = ({ onLogout }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    // Get admin data
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    if (authData) {
      setAdminInfo(JSON.parse(authData));
    }

    // Get last login info
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin) {
      setLoginInfo(JSON.parse(lastLogin));
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
      
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <>
          <img src='admin.png'alt="Admin Profile" className="w-24 h-24 rounded-full object-cover border-2 border-green-500"></img>
          
          </>
          <div className="flex-1">
             
            <h3 className="text-2xl font-bold text-gray-800">Administrator</h3>
          
            <p className="text-gray-600">{adminInfo?.email}</p>
            <div className="flex items-center gap-3">
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
             
            </div>
          </div>
        </div>
         <button className="flex px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition text-sm font-medium ">
                Edit Profile
              </button>
      </div>

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

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4"></h3>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
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
    </div>
  );
};

export default Profile;
