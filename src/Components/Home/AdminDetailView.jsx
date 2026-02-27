import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { API_BASE_URL } from '../../config/api';

const AdminDetailView = ({ admin, onBack, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picSrc, setPicSrc] = useState('');
  const [picAlt, setPicAlt] = useState('');
  const [picOpacity, setPicOpacity] = useState(0);

  useEffect(() => {
    if (admin?.id) {
      fetchUserProfile();
    }
  }, [admin?.id]);

  useEffect(() => {
    if (profileData) {
      const fullName = profileData.fullName || '';
      const nameParts = fullName.split(' ').filter(Boolean);
      setEditData({
        firstName: nameParts[0] || '',
        middleName: nameParts.slice(1, -1).join(' ') || '',
        lastName: nameParts[nameParts.length - 1] || '',
        dob: profileData.dateOfBirth || '',
        sex: profileData.sex || '',
        phone: profileData.phone || '',
        phone2: profileData.phone2 || '',
        email: profileData.email || '',
        whatsapp: profileData.whatsapp || '',
        facebook: profileData.facebook || '',
        address: profileData.address || ''
      });
    }
  }, [profileData]);

  const fetchUserProfile = async () => {
    if (!admin?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getUserProfile(admin.id);
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      if (admin?.id) {
        loadProfilePicture(admin.id);
      }
    }
  };

  const loadProfilePicture = async (userId) => {
    setPicSrc('');
    setPicAlt('Loading...');
    setPicOpacity(0.4);

    try {
      const response = await fetch(`${API_BASE_URL}/api/file/download/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
        body: JSON.stringify({ subject: 'PROFILE_PICTURE' }),
      });

      const result = await response.json();

      if (response.ok && result.file) {
        setPicSrc(`data:${result.mime_type};base64,${result.file}`);
        setPicAlt('Profile Picture');
        setPicOpacity(1);
      } else {
        setPicSrc('');
        setPicAlt('No picture available');
        setPicOpacity(1);
      }
    } catch (error) {
      console.error('Failed to load profile picture:', error);
      setPicSrc('');
      setPicAlt('Failed to load');
      setPicOpacity(1);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving admin profile with data:', editData);
      // For admin users, send contact info with empty address fields
      const updatePayload = {
        firstName: editData.firstName || '',
        middleName: editData.middleName || '',
        lastName: editData.lastName || '',
        phone: editData.phone || '',
        phone2: editData.phone2 || '',
        email: editData.email || '',
        facebook: editData.facebook || '',
        whatsapp: editData.whatsapp || '',
        // Required fields - send empty values for admin users
        province: '',
        district: '',
        municipality: '',
        ward: '',
        tole: '',
        dob: editData.dob || '',
        sex: editData.sex || '',
      };
      
      console.log('Update payload:', updatePayload);
      const response = await userService.updateAdminProfile(admin.id, updatePayload);
      console.log('Update response:', response);
      alert('Profile updated successfully');
      setIsEditing(false);
      await fetchUserProfile();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      alert(`Failed to update profile: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleStatusUpdate = async (action) => {
    const statusMap = { activate: 'ACTIVATED', suspend: 'SUSPENDED', deactivate: 'DEACTIVATED' };
    const targetStatus = statusMap[action];
    
    console.log('Current admin.status:', admin.status);
    console.log('Target status:', targetStatus);
    
    if (admin.status?.toUpperCase() === targetStatus.toUpperCase()) {
      alert(`User is already ${targetStatus}`);
      return;
    }

    try {
      await userService.updateUserStatus(admin.id, action);
      alert(`User ${targetStatus} successfully`);
      await fetchUserProfile();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(`Failed to update user status: ${error.response?.data?.error || error.message}`);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-xl text-gray-600">Loading profile...</div></div>;
  }

  const data = profileData || {};
  const fullName = data.fullName || '';
  const nameParts = fullName.split(' ').filter(Boolean);
  const firstName = nameParts[0] || admin.firstName || '';
  const lastName = nameParts.slice(1).join(' ') || admin.lastName || '';
  const userId = data.userId ?? admin.id;
  const userType = data.userType ?? admin.user_type ?? 'Admin';
  const joinDate = data.joinDate ?? admin.createdAt;
  const address = data.address ?? '';
  const phone = data.phone ?? '';
  const phone2 = data.phone2 ?? '';
  const email = data.email ?? '';
  const facebook = data.facebook ?? '';
  const whatsapp = data.whatsapp ?? '';
  const dob = data.dateOfBirth ?? '';
  const sex = data.sex ?? '';
  const about = data.about ?? '';
  const isVerified = admin.verified || false;

  return (
    <>
      <button onClick={onBack} className="mb-4 px-4 py-2 text-white rounded-lg hover:bg-gray-200">
        <img src="/left-arrow.png" alt="Back" className="w-10 h-10 inline-block mr-2" />
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 px-8 py-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white ring-opacity-30">
                {picSrc ? (
                  <img
                    src={picSrc}
                    alt={picAlt}
                    style={{ opacity: picOpacity, transition: 'opacity 0.4s ease' }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={userType === 'SuperAdmin' ? '/S_ADM.png' : '/ADM.png'}
                    alt={picAlt || 'Admin'}
                    style={{ opacity: picOpacity || 1, transition: 'opacity 0.4s ease' }}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  {fullName || `${firstName} ${lastName}`}
                  {admin.verified && <img src="/badge1.png" alt="Verified" className="w-6 h-6" />}
                </h3>
                <p className="text-purple-100 text-sm mt-1">{userId}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-purple-100">• Joined {new Date(joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${userType === 'SuperAdmin' ? 'bg-yellow-400 text-gray-800' : 'bg-white text-purple-600'}`}>
                {userType === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="p-8 space-y-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Edit Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <input type="text" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Phone</label>
                <input type="text" value={editData.phone2 || ''} onChange={(e) => setEditData({...editData, phone2: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                <input type="text" value={editData.whatsapp || ''} onChange={(e) => setEditData({...editData, whatsapp: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                <input type="text" value={editData.facebook || ''} onChange={(e) => setEditData({...editData, facebook: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📞</span> Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <img src="/telephone.png" alt="Mobile" className="w-5 h-5 mt-0.5" />
                    <span className="font-semibold text-gray-700 min-w-[80px]">Mobile:</span>
                    <span className="text-gray-900">{phone || 'N/A'}</span>
                  </div>
                  {phone2 && (
                    <div className="flex items-start gap-2">
                      <img src="/telephone.png" alt="Secondary" className="w-5 h-5 mt-0.5" />
                      <span className="font-semibold text-gray-700 min-w-[80px]">Secondary:</span>
                      <span className="text-gray-900">{phone2}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start gap-2">
                      <img src="/gmail.png" alt="Email" className="w-5 h-5 mt-0.5" />
                      <span className="font-semibold text-gray-700 min-w-[80px]">Email:</span>
                      <div className="flex items-center gap-2 flex-1">
                        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all flex-1">{email}</a>
                        <button onClick={copyEmail} className="hover:opacity-70 transition">
                          <img src={copiedEmail ? '/mark.png' : '/copy.png'} alt="Copy" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                  {whatsapp && (
                    <div className="flex items-start gap-2">
                      <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 mt-0.5" />
                      <span className="font-semibold text-gray-700 min-w-[80px]">WhatsApp:</span>
                      <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline break-all flex-1">{whatsapp}</a>
                    </div>
                  )}
                  {facebook && (
                    <div className="flex items-start gap-2">
                      <img src="/facebook.png" alt="Facebook" className="w-5 h-5 mt-0.5" />
                      <span className="font-semibold text-gray-700 min-w-[80px]">Facebook:</span>
                      <a href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all flex-1">{facebook}</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200">
                <h4 className="text-sm font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Personal Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-[80px]">DOB:</span>
                    <span className="text-gray-900">{dob || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-[80px]">Sex:</span>
                    <span className="text-gray-900">{sex || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-[80px]">User ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{userId}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-[80px]">Type:</span>
                    <span className="text-gray-900 font-semibold">{userType}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-[80px]">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.status === 'ACTIVATED' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {admin.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
                <h4 className="text-sm font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Address
                </h4>
                <div className="space-y-3">
                  {address ? (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700 min-w-[80px]">Address:</span>
                      <span className="text-gray-900">{address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">No address available</span>
                  )}
                </div>
              </div>
            </div>

            {about && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200 mb-6">
                <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📝</span> About
                </h4>
                <p className="text-gray-800 leading-relaxed">{about}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Account Management
          </h4>
          <div className="space-y-3">
            <button onClick={() => handleStatusUpdate('activate')} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition flex items-center justify-center gap-2">
              ✓ Activate
            </button>
            <button onClick={() => handleStatusUpdate('deactivate')} className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-md transition flex items-center justify-center gap-2">
              ❌ Deactivate
            </button>
            <button onClick={() => handleStatusUpdate('suspend')} className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold shadow-md transition flex items-center justify-center gap-2">
              ⏸️ Suspend
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">✏️</span> Profile Actions
          </h4>
          <div className="space-y-3">
            <button onClick={() => setIsEditing(true)} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition flex items-center justify-center gap-2">
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDetailView;
