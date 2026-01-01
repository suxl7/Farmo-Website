import { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleStatusChange = (productId, newStatus) => {
    const updated = products.map(p => p.id === productId ? { ...p, status: newStatus } : p);
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
    alert(`Product ${newStatus}`);
  };

  const handleDelete = (productId) => {
    if (confirm('Delete this product?')) {
      const updated = products.filter(p => p.id !== productId);
      localStorage.setItem('products', JSON.stringify(updated));
      setProducts(updated);
      alert('Product deleted');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Products ({products.length})</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-gray-600 mb-2">Farmer: {p.farmerName}</p>
                <p className="text-green-600 font-bold mb-2">₹{p.price}</p>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  p.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {p.status || 'Pending'}
                </span>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(p.id, 'Approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">No products listed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
