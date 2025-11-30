import badgeIcon from '../../assets/badge1.png';
import farmerIcon from '../../assets/farmer1.png';
import cropIcon from '../../assets/crop.png';
import customerIcon from '../../assets/customer1.png';

const Home = ({ setActiveSection, setSelectedFarmer }) => {
  const farmers = [
    { id: 'F0001', name: 'Robin Dangaura', address: 'Mahendranagar-4, Kanchanpur,Sudurpaschim', verified: true, rating: 4.9 },
    { id: 'F0002', name: 'Rohit Chaudhary', address: 'Lamki-3, Kailali, Sudurpaschim', verified: true, rating: 4.7 },
    { id: 'F0003', name: 'Asim Kusmi', address: 'Rajipur-4, Kailali, Sudurpaschim', verified: true, rating: 4.8 },
    { id: 'F0004', name: 'Roman Chaudhary', address: 'Tikapur-3, Kailali, Sudurpaschim', verified: false, rating: 4.5 },
    { id: 'F0005', name: 'Sushil Chaudhary', address: 'Godawari-1, Kailali, Sudurpaschim', verified: false, rating: 4.6 }
  ];

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setActiveSection('farmers');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <img src={farmerIcon} alt="Farmer" className="w-16 h-16 mb-2" />
            <div className="text-3xl font-bold">{farmers.length}</div>
            <div className="text-green-100">Total Farmers</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <img src={cropIcon} alt="Crops" className="w-16 h-16 mb-2" />
            <div className="text-3xl font-bold">24</div>
            <div className="text-blue-100">Active Products</div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <img src={customerIcon} alt="Customers" className="w-16 h-16 mb-2" />
            <div className="text-3xl font-bold">156</div>
            <div className="text-orange-100">Total Consumers</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Farmers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmers.map(farmer => (
              <div
                key={farmer.id}
                onClick={() => handleFarmerClick(farmer)}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      👨🌾
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="font-bold text-gray-800">{farmer.name}</h4>
                        {farmer.verified && (
                          <img src={badgeIcon} alt="Verified" className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{farmer.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-semibold">{farmer.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">📍 {farmer.address}</p>
                <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
