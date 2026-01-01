import { useState } from 'react';
import farmerIcon from '../../assets/farmer1.png';
import StatCard from './StatCard';
import FarmerGridCard from './FarmerGridCard';
import FarmerListCard from './FarmerListCard';
import FarmerDetailView from './FarmerDetailView';
import { useFarmers, useFilteredFarmers, useFarmerStats } from '../../hooks/useFarmers';

const STATS_CONFIG = [
  { label: 'Total Farmers', icon: farmerIcon, color: 'text-gray-800', key: 'total' },
  { label: 'Active', icon: '/activeuser.png', color: 'text-green-600', key: 'active' },
  { label: 'Verified', icon: '/check.png', color: 'text-purple-600', key: 'verified' },
  { label: 'Pending', icon: '/pending.png', color: 'text-yellow-600', key: 'pending' }
];

const Farmers = ({ selectedFarmer }) => {
  const { farmers, selectedFarmerData, setSelectedFarmerData, updateFarmer, deleteFarmer, bulkUpdateStatus } = useFarmers(selectedFarmer);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const filteredFarmers = useFilteredFarmers(farmers, searchTerm, statusFilter, verifiedFilter);
  const stats = useFarmerStats(farmers);

  const toggleSelectFarmer = (id) => {
    setSelectedFarmers(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleBulkAction = (status) => {
    bulkUpdateStatus(selectedFarmers, status);
    setSelectedFarmers([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Farmers Management</h2>
        </div>

        {!selectedFarmerData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {STATS_CONFIG.map(config => (
                <StatCard key={config.key} {...config} value={stats[config.key]} variant="white" />
              ))}
            </div>

            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search by name, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
                <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="All">All Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-300 text-white' : 'bg-gray-200'}`}>
                    <img src="/grid.png" alt="Grid" className="w-6 h-6" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-300 text-white' : 'bg-gray-200'}`}>
                    <img src="/list.png" alt="list" className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {selectedFarmers.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedFarmers.length} farmers selected</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleBulkAction('Active')} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Activate</button>
                    <button onClick={() => handleBulkAction('Inactive')} className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">Suspend</button>
                    <button onClick={() => setSelectedFarmers([])} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">Clear</button>
                  </div>
                </div>
              )}

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFarmers.map(f => (
                    <FarmerGridCard
                      key={f.id}
                      farmer={f}
                      isSelected={selectedFarmers.includes(f.id)}
                      onSelect={() => toggleSelectFarmer(f.id)}
                      onClick={() => setSelectedFarmerData(f)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFarmers.map(f => (
                    <FarmerListCard
                      key={f.id}
                      farmer={f}
                      isSelected={selectedFarmers.includes(f.id)}
                      onSelect={() => toggleSelectFarmer(f.id)}
                      onClick={() => setSelectedFarmerData(f)}
                    />
                  ))}
                </div>
              )}
              {filteredFarmers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No farmers found</p>
              )}
            </div>
          </>
        ) : (
          <FarmerDetailView
            farmer={selectedFarmerData}
            onBack={() => setSelectedFarmerData(null)}
            onUpdate={updateFarmer}
            onDelete={deleteFarmer}
          />
        )}
      </div>
    </div>
  );
};

export default Farmers;
