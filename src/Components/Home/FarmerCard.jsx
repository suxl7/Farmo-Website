const FarmerCard = ({ farmer, onClick }) => (
  <div onClick={() => onClick(farmer)} className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <img src="/user.png" alt={farmer.firstName} className="w-full h-full" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 flex items-center gap-1">
            {farmer.firstName} {farmer.lastName}
            {farmer.verified && <img src="/badge1.png" alt="Verified" className="w-4 h-4" />}
          </h4>
          <p className="text-xs text-gray-500">{farmer.id}</p>
        </div>
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-3">📍 {farmer.district}, {farmer.province}</p>
    <p className="text-sm text-gray-600 mb-3">📞 {farmer.mobileNumber}</p>
    <p className="text-sm text-gray-600 mb-3">⭐ Rating: {farmer.rating || 0} / 5</p>
    <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm">
      View Profile
    </button>
  </div>
);

export default FarmerCard;
