import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatCard from './StatCard';
import ConsumerDetailView from './ConsumerDetailView';
import { useConsumers } from '../../hooks/useConsumers';

const getStatusClass = (status) => {
  const map = {
    'Activated': 'bg-green-100 text-green-800',
    'Deactivated': 'bg-red-100 text-red-800',
    'Suspended': 'bg-orange-100 text-orange-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

const STATS_CONFIG = [
  { label: 'Total Consumers', icon: '/consumer.png', color: 'text-gray-800', id: 'total' },
  { label: 'Active', icon: '/user-check.png', color: 'text-green-600', id: 'active' },
  { label: 'Verified', icon: '/shield.png', color: 'text-purple-600', id: 'verified' },
  { label: 'Verification Pending', icon: '/pending.png', color: 'text-yellow-600', id: 'pending' }
];

const Consumers = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Activated');
  const [verifiedFilter, setVerifiedFilter] = useState('All Verification');
  const [districtFilter, setDistrictFilter] = useState('Any District');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsumers, setSelectedConsumers] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [selectedConsumerData, setSelectedConsumerData] = useState(null);

  const { consumers, stats, totalPages, loading, error, refreshData } = useConsumers({
    searchTerm, statusFilter, verifiedFilter, districtFilter
  }, currentPage);

  useEffect(() => {
    axios.get('/provinces_with_districts_and_municipalities.json')
      .then(({ data }) => {
        const districts = Object.values(data).flatMap(p => Object.keys(p));
        setAllDistricts([...new Set(districts)].sort());
      });
  }, []);

  useEffect(() => {
    if (userId && consumers?.length > 0 && !selectedConsumerData) {
      const consumer = consumers.find(c => c.id === userId);
      if (consumer) {
        setSelectedConsumerData(consumer);
      }
    }
  }, [userId, consumers]);

  const handleSelectConsumer = (consumer) => {
    setSelectedConsumerData(consumer);
    navigate(`/dashboard/consumers/${consumer.id}`);
  };

  const handleBackToList = () => {
    setSelectedConsumerData(null);
    navigate('/dashboard/consumers');
  };

  const handleConsumerUpdate = async () => {
    refreshData();
  };

  const toggleSelectConsumer = (id) => {
    setSelectedConsumers(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };

  const showDetailView = selectedConsumerData || userId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Consumers Management</h2>

        {!showDetailView ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {STATS_CONFIG.map(config => (
                <StatCard key={config.id} {...config} value={stats?.[config.id] || 0} variant="white" />
              ))}
            </div>

            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search by name and ID"
                  className="flex-1 min-w-[250px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                <select 
                  className="px-4 py-2 border rounded-lg"
                  value={districtFilter}
                  onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="Any District">Any District</option>
                  {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                  className="px-4 py-2 border rounded-lg"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="Activated">Activated</option>
                  <option value="Deactivated">Deactivated</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                  <option value="All Status">All Status</option>
                </select>
                <select 
                  className="px-4 py-2 border rounded-lg"
                  value={verifiedFilter}
                  onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="All Verification">All Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto relative">
                {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">Loading...</div>}
                <table className="w-full">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="p-3"><input type="checkbox" className="w-4 h-4" /></th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Rating</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumers?.length > 0 ? consumers.map(c => (
                      <tr key={c.id} onClick={() => handleSelectConsumer(c)} className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedConsumers.includes(c.id)} 
                            onChange={() => toggleSelectConsumer(c.id)}
                            className="w-4 h-4" 
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                              <img src="/user.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{c.contact}</td>
                        <td className="p-3 text-sm">{c.location}</td>
                        <td className="p-3 text-sm font-semibold text-yellow-600">⭐ {c.rating?.toFixed(1) || '0.0'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(c.status)}`}>
                            {c.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500">
                          {loading ? 'Loading...' : 'No consumers found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6 px-2">
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : selectedConsumerData ? (
          <ConsumerDetailView
            consumer={selectedConsumerData}
            onBack={handleBackToList}
            onUpdate={handleConsumerUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consumers;
