import { useState, useEffect, useMemo } from 'react';

const Consumers = () => {
  const [allConsumers, setAllConsumers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedConsumers, setSelectedConsumers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsumer, setEditingConsumer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingConsumer, setDeletingConsumer] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const consumersData = users.filter(u => u.userType === 'Consumer');
    setAllConsumers(consumersData);
  }, []);

  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(allConsumers.map(c => c.province))];
    return uniqueProvinces.sort();
  }, [allConsumers]);

  const filteredAndSortedConsumers = useMemo(() => {
    let filtered = allConsumers.filter(c => {
      const matchesSearch = searchTerm === '' || 
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobileNumber.includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesProvince = provinceFilter === 'All' || c.province === provinceFilter;
      return matchesSearch && matchesStatus && matchesProvince;
    });

    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'date': return new Date(b.registrationDate) - new Date(a.registrationDate);
        case 'orders': return (b.orderCount || 0) - (a.orderCount || 0);
        case 'spending': return (b.totalSpending || 0) - (a.totalSpending || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [allConsumers, searchTerm, statusFilter, provinceFilter, sortBy]);

  const paginatedConsumers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedConsumers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedConsumers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedConsumers.length / itemsPerPage);

  const stats = useMemo(() => ({
    total: allConsumers.length,
    active: allConsumers.filter(c => c.status === 'Active').length,
    inactive: allConsumers.filter(c => c.status === 'Inactive').length,
    totalOrders: allConsumers.reduce((sum, c) => sum + (c.orderCount || 0), 0),
    totalRevenue: allConsumers.reduce((sum, c) => sum + (c.totalSpending || 0), 0)
  }), [allConsumers]);

  const handleStatusChange = (consumerId, newStatus) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u => u.id === consumerId ? { ...u, status: newStatus } : u);
    localStorage.setItem('users', JSON.stringify(updated));
    setAllConsumers(prev => prev.map(c => c.id === consumerId ? { ...c, status: newStatus } : c));
  };

  const handleDelete = (consumerId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.filter(u => u.id !== consumerId);
    localStorage.setItem('users', JSON.stringify(updated));
    setAllConsumers(prev => prev.filter(c => c.id !== consumerId));
    setShowDeleteModal(false);
    setDeletingConsumer(null);
  };

  const handleBulkAction = (action) => {
    if (selectedConsumers.length === 0) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let updated = users;
    
    if (action === 'delete') {
      updated = users.filter(u => !selectedConsumers.includes(u.id));
      setAllConsumers(prev => prev.filter(c => !selectedConsumers.includes(c.id)));
    } else {
      updated = users.map(u => selectedConsumers.includes(u.id) ? { ...u, status: action } : u);
      setAllConsumers(prev => prev.map(c => selectedConsumers.includes(c.id) ? { ...c, status: action } : c));
    }
    
    localStorage.setItem('users', JSON.stringify(updated));
    setSelectedConsumers([]);
  };

  const handleEdit = (consumer) => {
    setEditingConsumer({ ...consumer });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u => u.id === editingConsumer.id ? editingConsumer : u);
    localStorage.setItem('users', JSON.stringify(updated));
    setAllConsumers(prev => prev.map(c => c.id === editingConsumer.id ? editingConsumer : c));
    setShowEditModal(false);
  };

  const toggleSelectAll = () => {
    if (selectedConsumers.length === paginatedConsumers.length) {
      setSelectedConsumers([]);
    } else {
      setSelectedConsumers(paginatedConsumers.map(c => c.id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Consumers ({filteredAndSortedConsumers.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Consumers</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">Rs.{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search by name, mobile, or ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={provinceFilter} onChange={(e) => { setProvinceFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="All">All Provinces</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="orders">Sort by Orders</option>
              <option value="spending">Sort by Spending</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Grid</button>
              <button onClick={() => setViewMode('table')} className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Table</button>
            </div>
            {selectedConsumers.length > 0 && (
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{selectedConsumers.length} selected</span>
                <button onClick={() => handleBulkAction('Active')} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Activate</button>
                <button onClick={() => handleBulkAction('Inactive')} className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Suspend</button>
                <button onClick={() => handleBulkAction('delete')} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            )}
          </div>
        </div>

        {paginatedConsumers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paginatedConsumers.map(c => (
                <div key={c.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{c.firstName} {c.lastName}</h3>
                        <p className="text-xs text-gray-500">{c.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                  </div>
                  <div className="space-y-1 text-sm mb-3">
                    <p className="text-gray-700">📞 {c.mobileNumber}</p>
                    {c.email && <p className="text-gray-700">📧 {c.email}</p>}
                    <p className="text-gray-700">📍 {c.district}, {c.province}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusChange(c.id, c.status === 'Active' ? 'Inactive' : 'Active')} className={`flex-1 px-3 py-1 rounded text-sm ${c.status === 'Active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>{c.status === 'Active' ? 'Suspend' : 'Activate'}</button>
                    <button onClick={() => { setDeletingConsumer(c); setShowDeleteModal(true); }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConsumers.map(c => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-500">{c.id}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p>{c.mobileNumber}</p>
                        {c.email && <p className="text-gray-500 text-xs">{c.email}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm">{c.district}, {c.province}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleStatusChange(c.id, c.status === 'Active' ? 'Inactive' : 'Active')} className={`px-2 py-1 rounded text-xs ${c.status === 'Active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>{c.status === 'Active' ? 'Suspend' : 'Activate'}</button>
                          <button onClick={() => { setDeletingConsumer(c); setShowDeleteModal(true); }} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mb-6">
            <p className="text-gray-500 text-lg">No consumers found</p>
          </div>
        )}

        {showDeleteModal && deletingConsumer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to delete <span className="font-semibold">{deletingConsumer.firstName} {deletingConsumer.lastName}</span>?</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
                  <button onClick={() => handleDelete(deletingConsumer.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consumers;
