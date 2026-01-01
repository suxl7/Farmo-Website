import { useState } from 'react';

const FarmerDetailView = ({ farmer, onBack, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...farmer });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <>
      <button onClick={onBack} className="mb-4 px-4 py-2 text-white rounded-lg hover:bg-gray-200">
        <img src="/left-arrow.png" alt="Back" className="w-10 h-10 inline-block mr-2" />
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="/user.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {farmer.firstName} {farmer.lastName}
                  {farmer.verified && <img src="/badge1.png" alt="Verified" className="w-5 h-5" />}
                </h3>
                <p className="text-green-100">{farmer.id}</p>
                <p className="text-green-100">⭐ {farmer.rating || 0}/5</p>
              </div>
            </div>
            {farmer.verified && <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold">✓ Verified</span>}
          </div>
        </div>

        {isEditing ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Mobile</label><input type="text" value={editData.mobileNumber} onChange={(e) => setEditData({...editData, mobileNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Rating (0-5)</label><input type="number" min="0" max="5" step="0.1" value={editData.rating || 0} onChange={(e) => setEditData({...editData, rating: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              {!farmer.verified && (
                <>
                  <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">District</label><input type="text" value={editData.district} onChange={(e) => setEditData({...editData, district: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Province</label><input type="text" value={editData.province} onChange={(e) => setEditData({...editData, province: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">📞 Contact Information</h4>
                <div className="space-y-2">
                  <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Mobile:</span> {farmer.mobileNumber}</p>
                  {farmer.secondaryMobileNumber && <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Secondary:</span> {farmer.secondaryMobileNumber}</p>}
                  {farmer.email && <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Email:</span> {farmer.email}</p>}
                  {farmer.whatsapp && <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">WhatsApp:</span> {farmer.whatsapp}</p>}
                  {farmer.facebook && <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Facebook:</span> {farmer.facebook}</p>}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">👤 Personal Details</h4>
                <div className="space-y-2">
                  <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">DOB:</span> {farmer.dateOfBirth}</p>
                  <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Sex:</span> {farmer.sex}</p>
                  <p className="text-gray-900 flex items-center gap-2"><span className="font-medium">Joined:</span> {new Date(farmer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">📍 Address</h4>
                <div className="space-y-2">
                  <p className="text-gray-900"><span className="font-medium">Province:</span> {farmer.province}</p>
                  <p className="text-gray-900"><span className="font-medium">District:</span> {farmer.district}</p>
                  {farmer.municipality && <p className="text-gray-900"><span className="font-medium">Municipality:</span> {farmer.municipality}</p>}
                  {farmer.ward && <p className="text-gray-900"><span className="font-medium">Ward:</span> {farmer.ward}</p>}
                  {farmer.tole && <p className="text-gray-900"><span className="font-medium">Tole:</span> {farmer.tole}</p>}
                </div>
              </div>
            </div>
            {farmer.aboutUser && (
              <div className="px-6 pb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{farmer.aboutUser}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">⚙️ Admin Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">✏️ Edit</button>
            {!farmer.verified && <button onClick={() => onUpdate({...farmer, verified: true})} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">🛡️ Verify</button>}
            <button onClick={() => onUpdate({...farmer, status: 'Active'})} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">✓ Activate</button>
            <button onClick={() => onUpdate({...farmer, status: 'Inactive'})} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2">⏸️ Suspend</button>
            <button onClick={() => onUpdate({...farmer, status: 'Pending'})} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">⏳ Pending</button>
            <button onClick={() => onDelete(farmer.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">🗑️ Delete</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">📊 Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Products</span>
              <span className="text-xl font-bold text-blue-600">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Orders</span>
              <span className="text-xl font-bold text-green-600">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Revenue</span>
              <span className="text-xl font-bold text-purple-600">Rs. 0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerDetailView;
