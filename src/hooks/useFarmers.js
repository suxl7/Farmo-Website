import { useState, useEffect, useMemo } from 'react';

export const useFarmers = (selectedFarmer) => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);

  useEffect(() => {
    loadFarmers();
  }, []);

  useEffect(() => {
    if (selectedFarmer) {
      setSelectedFarmerData(selectedFarmer);
    }
  }, [selectedFarmer]);

  const loadFarmers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const farmersList = users.filter(u => u.userType === 'Farmer').map(f => ({
      ...f,
      status: f.status || 'Active',
      rating: f.rating || 0
    }));
    setFarmers(farmersList);
  };

  const updateFarmer = (updatedFarmer) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u => u.id === updatedFarmer.id ? updatedFarmer : u);
    localStorage.setItem('users', JSON.stringify(updated));
    loadFarmers();
    if (selectedFarmerData?.id === updatedFarmer.id) {
      setSelectedFarmerData(updatedFarmer);
    }
  };

  const deleteFarmer = (farmerId) => {
    if (confirm('Are you sure you want to delete this farmer?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updated = users.filter(u => u.id !== farmerId);
      localStorage.setItem('users', JSON.stringify(updated));
      loadFarmers();
      setSelectedFarmerData(null);
      alert('Farmer deleted successfully');
    }
  };

  const bulkUpdateStatus = (farmerIds, status) => {
    if (farmerIds.length === 0) return alert('No farmers selected');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u => farmerIds.includes(u.id) ? { ...u, status } : u);
    localStorage.setItem('users', JSON.stringify(updated));
    loadFarmers();
    alert(`${farmerIds.length} farmers updated to ${status}`);
  };

  return {
    farmers,
    selectedFarmerData,
    setSelectedFarmerData,
    updateFarmer,
    deleteFarmer,
    bulkUpdateStatus
  };
};

export const useFilteredFarmers = (farmers, searchTerm, statusFilter, verifiedFilter) => {
  return useMemo(() => {
    return farmers.filter(f => {
      const matchesSearch = `${f.firstName} ${f.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           f.mobileNumber?.includes(searchTerm) || f.id?.includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchesVerified = verifiedFilter === 'All' || 
                             (verifiedFilter === 'Verified' && f.verified) ||
                             (verifiedFilter === 'Unverified' && !f.verified);
      return matchesSearch && matchesStatus && matchesVerified;
    });
  }, [farmers, searchTerm, statusFilter, verifiedFilter]);
};

export const useFarmerStats = (farmers) => {
  return useMemo(() => ({
    total: farmers.length,
    active: farmers.filter(f => f.status === 'Active').length,
    verified: farmers.filter(f => f.verified).length,
    pending: farmers.filter(f => f.status === 'Pending').length
  }), [farmers]);
};
