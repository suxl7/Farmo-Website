import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import { useAdmins } from '../../hooks/useAdmins';
import AdminDetailView from './AdminDetailView';

const getStatusClass = (status) => {
  const map = {
    'ACTIVATED': 'bg-green-100 text-green-800',
    'DEACTIVATED': 'bg-red-100 text-red-800',
    'SUSPENDED': 'bg-orange-100 text-orange-800',
    'PENDING': 'bg-yellow-100 text-yellow-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

const STATS_CONFIG = [
  { label: 'Total Admins', icon: '/personnel.png', color: 'text-gray-800', id: 'total' },
  { label: 'Super Admins', icon: '/superA.png', color: 'text-blue-600', id: 'superAdmins' },
  { label: 'Admins', icon: '/ADM.png', color: 'text-green-600', id: 'admins' }
];

const Admins = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVATED');
  const [userTypeFilter, setUserTypeFilter] = useState('All Admins');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectedAdminData, setSelectedAdminData] = useState(null);

  const { admins, stats, totalPages, loading, error, refreshData } = useAdmins({
    searchTerm, statusFilter, userTypeFilter
  }, currentPage);

  console.log('Admins component - admins:', admins);
  console.log('Admins component - loading:', loading);
  console.log('Admins component - error:', error);

  useEffect(() => {
    if (userId && admins?.length > 0 && !selectedAdminData) {
      const admin = admins.find(a => a.id === userId);
      if (admin) {
        setSelectedAdminData(admin);
      }
    }
  }, [userId, admins]);

  const handleSelectAdmin = (admin) => {
    setSelectedAdminData(admin);
    navigate(`/dashboard/admins/${admin.id}`);
  };

  const handleBackToList = () => {
    setSelectedAdminData(null);
    navigate('/dashboard/admins');
  };

  const handleAdminUpdate = async () => {
    await refreshData();
    if (userId && admins?.length > 0) {
      const updatedAdmin = admins.find(a => a.id === userId);
      if (updatedAdmin) {
        setSelectedAdminData(prev => ({ ...prev, ...updatedAdmin }));
      }
    }
  };

  const toggleSelectAdmin = (id) => {
    setSelectedAdmins(prev => prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]);
  };

  const showDetailView = selectedAdminData || userId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admins Management</h2>

        {!showDetailView ? (
          <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              value={userTypeFilter}
              onChange={(e) => { setUserTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All Admins">All Admins</option>
              <option value="SuperAdmin">Super Admin</option>
              <option value="Admin">Admin</option>
            </select>
            <select 
              className="px-4 py-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ACTIVATED">Activated</option>
              <option value="DEACTIVATED">Deactivated</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
              <option value="All Status">All Status</option>
            </select>
          </div>

          <div className="overflow-x-auto relative">
            {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">Loading...</div>}
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="p-3"><input type="checkbox" className="w-4 h-4" /></th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">User Type</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {admins?.length > 0 ? admins.map(a => (
                  <tr key={a.id} onClick={() => handleSelectAdmin(a)} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedAdmins.includes(a.id)} 
                        onChange={() => toggleSelectAdmin(a.id)}
                        className="w-4 h-4" 
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                          <img src={a.user_type === 'SuperAdmin' ? '/superA.png' : '/ADM.png'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{a.name}</p>
                          <p className="text-xs text-gray-500">{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{a.user_type || 'N/A'}</td>
                    <td className="p-3 text-sm">{a.contact}</td>
                    <td className="p-3 text-sm">{a.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(a.status)}`}>
                        {a.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      {loading ? 'Loading...' : 'No admins found'}
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
        ) : selectedAdminData ? (
          <AdminDetailView
            admin={selectedAdminData}
            onBack={handleBackToList}
            onUpdate={handleAdminUpdate}
            onDelete={(id) => {
              console.log('Delete admin:', id);
              handleBackToList();
            }}
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

export default Admins;
