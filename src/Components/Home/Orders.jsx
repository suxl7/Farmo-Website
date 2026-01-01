import { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('orders', JSON.stringify(updated));
    setOrders(updated);
    alert(`Order status updated to ${newStatus}`);
  };

  const handleCancel = (orderId) => {
    if (confirm('Cancel this order?')) {
      handleStatusChange(orderId, 'Cancelled');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders ({orders.length})</h2>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{o.id}</h3>
                    <p className="text-gray-600">Customer: {o.customerName}</p>
                    <p className="text-gray-600">Product: {o.productName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    o.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {o.status || 'Pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(o.id, 'Processing')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleStatusChange(o.id, 'Delivered')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleCancel(o.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
