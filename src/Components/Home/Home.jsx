import { useState, useEffect, useMemo } from 'react';
import farmerIcon from '../../assets/farmer1.png';
import cropIcon from '../../assets/crop.png';
import customerIcon from '../../assets/customer1.png';
import badgeIcon from '../../assets/badge1.png';
import Footer from './Footer';
import StatCard from './StatCard';
import FarmerCard from './FarmerCard';

const STATS_CONFIG = [
  { icon: farmerIcon, label: 'Total Farmers', color: 'from-green-400 to-green-600', textColor: 'text-green-100', key: 'farmers' },
  { icon: cropIcon, label: 'Active Products', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-100', key: 'products' },
  { icon: customerIcon, label: 'Total Consumers', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-100', key: 'consumers' },
  { icon: badgeIcon, label: 'Verification Requests', color: 'from-purple-400 to-purple-600', textColor: 'text-purple-100', key: 'verifications' }
];

const Home = ({ setActiveSection, setSelectedFarmer }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const { farmers, stats } = useMemo(() => {
    const allFarmers = users.filter(u => u.userType === 'Farmer').map(f => ({ ...f, rating: f.rating || 0 }));
    const popularFarmers = allFarmers.sort((a, b) => b.rating - a.rating).slice(0, 6);
    const allConsumers = users.filter(u => u.userType === 'Consumer');
    
    return {
      farmers: popularFarmers,
      stats: {
        farmers: allFarmers.length,
        products: 0,
        consumers: allConsumers.length,
        verifications: 0
      }
    };
  }, [users]);

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setActiveSection('farmers');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {STATS_CONFIG.map(config => (
            <StatCard key={config.key} {...config} value={stats[config.key]} />
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Farmers</h3>
          {farmers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmers.map(farmer => (
                <FarmerCard key={farmer.id} farmer={farmer} onClick={handleFarmerClick} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No farmers registered yet</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
