const getStatusClass = (status) => {
  if (status === 'Active') return 'bg-green-100 text-green-800';
  if (status === 'Inactive') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const FarmerListCard = ({ farmer, isSelected, onSelect, onClick }) => (
  <div className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition flex items-center gap-4">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onSelect}
      className="w-4 h-4"
    />
    <div onClick={onClick} className="flex-1 cursor-pointer flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
          <img src="/user.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-medium text-lg flex items-center gap-2">
            {farmer.firstName} {farmer.lastName}
            {farmer.verified && <img src="/badge1.png" alt="Verified" className="w-4 h-4" />}
          </p>
          <p className="text-sm text-gray-600">{farmer.mobileNumber} • {farmer.district} • ⭐ {farmer.rating || 0}/5</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400">{new Date(farmer.createdAt).toLocaleDateString()}</span>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(farmer.status)}`}>
          {farmer.status}
        </span>
      </div>
    </div>
  </div>
);

export default FarmerListCard;
