import { useState, useEffect, useMemo } from 'react';
import { productService } from '../../services';
import StatCard from './StatCard';
import cropIcon from '../../assets/crop.png';

const STATS_CONFIG = [
  { id: 'todayAdded', icon: cropIcon, label: "Today's Product List", color: 'from-blue-400 to-blue-600', textColor: 'text-blue-100' },
  { id: 'active', icon: cropIcon, label: 'Active Products', color: 'from-green-400 to-green-600', textColor: 'text-green-100' },
  { id: 'total', icon: cropIcon, label: 'Total Listed Products', color: 'from-purple-400 to-purple-600', textColor: 'text-purple-100' }
];

const Products = ({ selectedFarmerId }) => {
  
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');
  const [productStatus, setProductStatus] = useState('Available');
  const [allDistricts, setAllDistricts] = useState([]);
  const [stats, setStats] = useState({ todayAdded: 0, active: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrevious: false
  });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const filters = { page };
      
      if (searchTerm) filters.search_term = searchTerm;
      if (selectedDistrict !== 'All') filters.district = selectedDistrict;
      if (farmerSearchTerm) filters.farmer = farmerSearchTerm;
      if (productStatus !== 'All') filters.product_status = productStatus;
      
      console.log('Sending filters:', filters);
      const data = await productService.filterProducts(filters);
      console.log('Product data received:', data);
      
      setProducts(data.products || []);
      setPagination({
        currentPage: data.current_page || 1,
        totalPages: data.total_pages || 1,
        totalProducts: data.total_products || 0,
        hasNext: data.has_next || false,
        hasPrevious: data.has_previous || false
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', error.response?.data);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const data = await productService.getProductStats();
      setStats({
        todayAdded: data.todays_product_list || 0,
        active: data.active_product || 0,
        total: data.total_listed_product || 0
      });
    } catch (error) {
      console.error('Error fetching product stats:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductStats();
  }, []);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  useEffect(() => {
    fetch('/provinces_with_districts_and_municipalities.json')
      .then(res => res.json())
      .then(data => {
        const districts = Object.values(data).flatMap(p => Object.keys(p));
        setAllDistricts([...new Set(districts)].sort());
      });
  }, []);

  const districts = useMemo(() => allDistricts, [allDistricts]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('All');
    setFarmerSearchTerm('');
    setProductStatus('All');
    setTimeout(() => fetchProducts(1), 0);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating || 0)) + '☆'.repeat(5 - Math.floor(rating || 0));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {STATS_CONFIG.map(config => (
            <StatCard key={config.id} {...config} value={stats[config.id]} variant="white" />
          ))}
        </div>

        {/* Search and Filter Panel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Search & Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                placeholder="🔍 Search by product ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Address</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="All">All Districts</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
              <select
                value={productStatus}
                onChange={(e) => setProductStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Expired">Expired</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Farmer</label>
                <input
                  type="text"
                  placeholder="Enter farmer name or ID..."
                  value={farmerSearchTerm}
                  onChange={(e) => setFarmerSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {products.length} of {pagination.totalProducts} products (Page {pagination.currentPage} of {pagination.totalPages})
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(p => (
                    <tr key={p.p_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🌾</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{p.name || 'Unnamed Product'}</div>
                            <div className="text-xs text-gray-500">ID: {p.p_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.product_type || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{p.farmer || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">ID: {p.user_id || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <span className="text-yellow-400">{renderStars(p.rating || 0)}</span>
                          <span className="ml-2 text-gray-600">({(p.rating || 0).toFixed(1)})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rs. {p.sales || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.product_status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : p.product_status === 'Sold'
                            ? 'bg-blue-100 text-blue-800'
                            : p.product_status === 'Expired'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.product_status || 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          title="View Details"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    pagination.hasPrevious
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    pagination.hasNext
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No products found matching your filters</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
