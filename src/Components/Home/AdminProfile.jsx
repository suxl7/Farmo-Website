import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import SessionData from "../../utils/SessionData";

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    phone2: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    tole: "",
    dob: "",
    sex: "",
    facebook: "",
    whatsapp: "",
    about: "",
  });
  const [pictureData, setPictureData] = useState({ profilePicture: null });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutType, setLogoutType] = useState("");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false, edit: false });
  const [picSrc, setPicSrc] = useState('');
  const [picAlt, setPicAlt] = useState('');
  const [picOpacity, setPicOpacity] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogoutClick = async (type) => {
    if (type === "all") {
      setLogoutType(type);
      setShowLogoutConfirm(true);
    } else {
      await performLogout("/api/auth/logout/");
    }
  };      


  const performLogout = async (endpoint) => {
    try {
     
     
      await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "token": SessionData.getToken(),
          "user-id": SessionData.getUserId(),
          "Content-Type": "application/json",
        },
      });

      onLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      onLogout();
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);


  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                            View Profile API Call
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OWN_PROFILE}`, {
        method: "POST",
        headers: {
          "token": SessionData.getToken(),
          "user-id": SessionData.getUserId(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data);
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
      loadProfilePicture(SessionData.getUserId(), setPicSrc, setPicAlt, setPicOpacity);
    }
  };


  const loadProfilePicture = async (userId, setSrc, setAlt, setOpacity) => {
  // Show a loading placeholder while fetching
  setSrc('');
  setAlt('Loading...');
  setOpacity(0.4);

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FILE_DOWNLOAD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
      },
      body: JSON.stringify({ subject: 'PROFILE_PICTURE' }),
    });

    const result = await response.json();

    if (response.ok && result.file) {
      setSrc(`data:${result.mime_type};base64,${result.file}`);
      setAlt('Profile Picture');
      setOpacity(1);
    } else {
      setAlt('No picture available');
      setOpacity(1);
    }
  } catch (error) {
    console.error('Failed to load profile picture:', error);
    setAlt('Failed to load picture');
    setOpacity(1);
  }
};

  const fetchUserAddress = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADDRESS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': SessionData.getToken(),
          'user-id': SessionData.getUserId(),
        },
        body: JSON.stringify({ 'user-id': userId }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
    return null;
  };

  const splitWords = (str) => {
    const words = str.trim().split(' ');
    if (words.length === 1) return { first: words[0], middle: '', last: '' };
    if (words.length === 2) return { first: words[0], middle: '', last: words[1] };
    return { first: words[0], middle: words.slice(1, -1).join(' '), last: words[words.length - 1] };
  };


  const handleEditProfile = async () => {
    const addressData = await fetchUserAddress(SessionData.getUserId());
    const { first, middle, last } = splitWords(adminInfo?.full_name || '');
    
    setEditData({
      first_name: first,
      middle_name: middle,
      last_name: last,
      phone: adminInfo?.phone || "",
      phone2: adminInfo?.phone2 || "",
      province: addressData?.province || "",
      district: addressData?.district || "",
      municipality: addressData?.municipal || "",
      ward: addressData?.ward || "",
      tole: addressData?.tole || "",
      dob: adminInfo?.dob || "",
      sex: adminInfo?.sex || "",
      facebook: adminInfo?.facebook || "",
      whatsapp: adminInfo?.whatsapp || "",
      about: adminInfo?.about || "",
    });
    setIsEditing(true);
  };

  const handleUploadPicture = () => {
    setPictureData({ profilePicture: null });
    setIsUploadingPicture(true);
  };

  const handleUpdateProfile = async () => {
    setShowConfirmPassword(true);
  };

  const handleConfirmUpdate = async () => {
    if (!confirmPassword) {
      alert("Please enter your password");
      return;
    }

    try {
      const checkResponse = await fetch(`${API_BASE_URL}/api/user/check-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'token': SessionData.getToken(),
          "user-id": SessionData.getUserId(),
        },
        body: JSON.stringify({ password: confirmPassword }),
      });

      if (!checkResponse.ok) {
        alert("Incorrect password");
        setConfirmPassword('');
        return;
      }

      const updatePayload = {
        f_name: editData.first_name?.trim() || '',
        m_name: editData.middle_name?.trim() || '',
        l_name: editData.last_name?.trim() || '',
        phone: editData.phone?.trim() || '',
        phone2: editData.phone2?.trim() || '',
        province: editData.province?.trim() || '',
        district: editData.district?.trim() || '',
        municipal: editData.municipality?.trim() || '',
        ward: editData.ward?.trim() || '',
        tole: editData.tole?.trim() || '',
        dob: editData.dob || '',
        sex: editData.sex || '',
        facebook: editData.facebook?.trim() || '',
        whatsapp: editData.whatsapp?.trim() || '',
        about: editData.about?.trim() || '',
      };

      console.log('Update payload:', updatePayload);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": SessionData.getToken(),
          "user-id": SessionData.getUserId(),
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        await fetchAdminProfile();
        setShowConfirmPassword(false);
        setConfirmPassword('');
        setIsEditing(false);
        alert("Profile updated successfully");
      } else {
        const responseData = await response.json().catch(() => ({}));
        console.error('Update error:', response.status, responseData);
        alert(responseData.error || `Unable to update profile (${response.status})`);
        setConfirmPassword('');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Unable to update profile: " + error.message);
    }
  };

  const handleSaveProfile = async () => {
    if (!pictureData.profilePicture) {
      alert("Please select a profile picture");
      return;
    }

    const file = pictureData.profilePicture;
    setUploading(true);
    try {
      // Step 1: Init
      const initRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FILE_UPLOAD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": SessionData.getUserId(),
        },
        body: JSON.stringify({
          action: "init",
          subject: "PROFILE_PICTURE",
          file_name: file.name,
          file_size: file.size,
          total_chunks: Math.ceil(file.size / (2 * 1024 * 1024)),
        }),
      });

      if (!initRes.ok) throw new Error("Init failed");
      const { upload_id, total_chunks } = await initRes.json();

      // Step 2: Upload chunk(s)
      const CHUNK_SIZE = total_chunks === 1 ? file.size : 2 * 1024 * 1024;
      for (let i = 0; i < total_chunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const formData = new FormData();
        formData.append("action", "chunk");
        formData.append("upload_id", upload_id);
        formData.append("chunk_index", i);
        formData.append("file", chunk, file.name);

        const chunkRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FILE_UPLOAD}`, {
          method: "POST",
          headers: { "user-id": SessionData.getUserId() },
          body: formData,
        });

        if (!chunkRes.ok) throw new Error(`Chunk ${i} failed`);
      }

      // Step 3: Finish
      const finishRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FILE_UPLOAD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": SessionData.getUserId(),
        },
        body: JSON.stringify({ action: "finish", upload_id }),
      });

      if (!finishRes.ok) throw new Error("Finish failed");

      alert("Profile picture updated successfully");
      setIsUploadingPicture(false);
      setPictureData({ profilePicture: null });
      await fetchAdminProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setMessage("");
    setShowChangePassword(true);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setMessage("Please fill all fields");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                            Change Password API Call
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`,
        {
          method: "POST",
          headers: {
            'token': SessionData.getToken(),
            'user-id': SessionData.getUserId(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: passwordData.current,
            new_password: passwordData.new,
          }),
        },
      );

      if (response.ok) {
        alert("Password changed successfully");
        setShowChangePassword(false);
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Error changing password");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full border-2 border-green-500 overflow-hidden">
              {picSrc ? (
                <img
                  src={picSrc}
                  alt={picAlt}
                  style={{ opacity: picOpacity, transition: 'opacity 0.4s ease' }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/admin.png"
                  alt={picAlt || 'Admin'}
                  style={{ opacity: picOpacity || 1, transition: 'opacity 0.4s ease' }}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">
                {adminInfo?.full_name || "Administrator"}
              </h3>
              <p className="text-gray-600">{adminInfo?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {adminInfo?.user_type || "Active"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUploadPicture}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Upload Picture
            </button>
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Upload Picture Modal */}
      {isUploadingPicture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Upload Profile Picture
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPictureData({ profilePicture: e.target.files[0] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={uploading}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 256 256" stroke="currentColor" fill="none">
                        <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeWidth="24" />
                        <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeWidth="24" />
                        <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeWidth="24" />
                        <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeWidth="24" />
                        <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeWidth="24" />
                        <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeWidth="24" />
                        <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeWidth="24" />
                        <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeWidth="24" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
                <button
                  onClick={() => setIsUploadingPicture(false)}
                  disabled={uploading}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Edit Profile Information
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" value={editData.first_name} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input type="text" value={editData.middle_name} onChange={(e) => setEditData({ ...editData, middle_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" value={editData.last_name} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                <input type="text" value={editData.phone2} onChange={(e) => setEditData({ ...editData, phone2: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input type="text" value={editData.province} onChange={(e) => setEditData({ ...editData, province: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" value={editData.district} onChange={(e) => setEditData({ ...editData, district: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                <input type="text" value={editData.municipality} onChange={(e) => setEditData({ ...editData, municipality: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                <input type="text" value={editData.ward} onChange={(e) => setEditData({ ...editData, ward: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tole</label>
                <input type="text" value={editData.tole} onChange={(e) => setEditData({ ...editData, tole: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={editData.dob} onChange={(e) => setEditData({ ...editData, dob: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={editData.sex} onChange={(e) => setEditData({ ...editData, sex: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input type="text" value={editData.facebook} onChange={(e) => setEditData({ ...editData, facebook: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="text" value={editData.whatsapp} onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea value={editData.about} onChange={(e) => setEditData({ ...editData, about: e.target.value })} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{adminInfo?.email || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="text-gray-800">{adminInfo?.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Phone 2:</span>
            <span className="text-gray-800">{adminInfo?.phone2 || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="text-gray-800">{adminInfo?.address || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">User Type:</span>
            <span className="text-gray-800">{adminInfo?.user_type || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Date of Birth:</span>
            <span className="text-gray-800">{adminInfo?.dob || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Gender:</span>
            <span className="text-gray-800">{adminInfo?.sex || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Join Date:</span>
            <span className="text-gray-800">
              {adminInfo?.join_date ? new Date(adminInfo.join_date).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Facebook:</span>
            <span className="text-gray-800">{adminInfo?.facebook || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">WhatsApp:</span>
            <span className="text-gray-800">{adminInfo?.whatsapp || "N/A"}</span>
          </div>
          {adminInfo?.about && (
            <div className="py-2 border-b">
              <span className="text-gray-600 font-medium block mb-1">About:</span>
              <p className="text-gray-800">{adminInfo.about}</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Security Settings
        </h3>
        
        <button
          onClick={handleChangePassword}
          className="w-80 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          Change Password
        </button>
      <div className="mt-4" />

      
        <div className="flex flex-col items-left space-y-3">
          <button
        onClick={() => handleLogoutClick("current")}
        className="w-80 py-2 bg-slate-700 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
        <img src="/log-out.png" alt="logout" className="w-5 h-5" />
        Logout
          </button>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => performLogout("/api/auth/logout/")}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Change Password
            </h3>
            {message && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {message}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showPassword.current ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showPassword.new ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showPassword.confirm ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Password Modal */}
      {showConfirmPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Changes</h3>
            <p className="text-gray-600 mb-4">Please enter your password to confirm the changes</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword.edit ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, edit: !showPassword.edit })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <img src={showPassword.edit ? "/show.png" : "/delete.png"} alt="toggle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmUpdate}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setShowConfirmPassword(false); setConfirmPassword(''); }}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;