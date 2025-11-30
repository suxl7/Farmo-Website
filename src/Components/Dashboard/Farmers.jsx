import badgeIcon from '../../assets/badge1.png';

const Farmers = ({ selectedFarmer }) => {
  const farmerDetails = {
    'F0001': {
      id: 'F0001',
      name: 'Robin Dangaura',
      address: 'Mahendranagar, Kanchanpur, Nepal',
      phone: '+977 9800256643',
      email: 'robbery56@gmail..com',
      crops: ['Wheat', 'Rice', 'Sugarcane'],
      rating: 4.5,
      totalSales: '₹2,45,000',
      joinedDate: 'Jan 2023',
      landSize: '5 Acres',
      verified: true
    },
    'F0002': {
      id: 'F0002',
      name: 'Rohit Chaudhary',
      address: 'Lamki, Kailali, Nepal',
      phone: '+977 9812345678',
      email: 'rohit3@gmail.com',
      crops: ['Grapes', 'Onion'],
      rating: 4.8,
      totalSales: '₹3,80,000',
      joinedDate: 'Mar 2023',
      landSize: '8 Acres',
      verified: true
    }
  };

  const farmer = selectedFarmer ? farmerDetails[selectedFarmer.id] || farmerDetails['F0001'] : farmerDetails['F0001'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Farmer Details</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                👨🌾
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold">{farmer.name}</h3>
                  {farmer.verified && (
                    <img src={badgeIcon} alt="Verified" className="w-6 h-6" />
                  )}
                </div>
                <p className="text-green-100">{farmer.id}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-300 text-xl">⭐</span>
                  <span className="ml-2 font-semibold">{farmer.rating}/5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
              <p className="text-gray-900 mb-2">📞 {farmer.phone}</p>
              <p className="text-gray-900 mb-2">📧 {farmer.email}</p>
              <p className="text-gray-900">📍 {farmer.address}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Farm Details</h4>
              <p className="text-gray-900 mb-2">🌾 Land Size: {farmer.landSize}</p>
              <p className="text-gray-900 mb-2">💰 Total Sales: {farmer.totalSales}</p>
              <p className="text-gray-900">📅 Joined: {farmer.joinedDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Crops Listed</h4>
            <div className="space-y-3">
              {farmer.crops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-800">🌾 {crop}</span>
                  <span className="text-green-600 text-sm">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Performance Insights</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Delivery Rate</span>
                  <span className="text-sm font-medium text-gray-900">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Product Quality</span>
                  <span className="text-sm font-medium text-gray-900">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farmers;
