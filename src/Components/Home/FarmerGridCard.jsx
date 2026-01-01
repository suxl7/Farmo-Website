const getStatusClass = (status) => {
  if (status === 'Active') return 'bg-green-100 text-green-800';
  if (status === 'Inactive') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const FarmerGridCard = ({ farmer, isSelected, onSelect, onClick }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition cursor-pointer relative">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={(e) => { e.stopPropagation(); onSelect(); }}
      className="absolute top-3 left-3 w-4 h-4"
    />
    <div onClick={onClick} className="ml-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
          <img src="/user.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            {farmer.firstName} {farmer.lastName}
            {farmer.verified && <img src="/badge1.png" alt="Verified" className="w-4 h-4" />}
          </p>
          <p className="text-xs text-gray-500">{farmer.id}</p>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>📞 {farmer.mobileNumber}</p>
        <p>📍 {farmer.district}, {farmer.province}</p>
        <p>⭐ {farmer.rating || 0}/5</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(farmer.status)}`}>
          {farmer.status}
        </span>
        <span className="text-xs text-gray-400">{new Date(farmer.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

export default FarmerGridCard;
