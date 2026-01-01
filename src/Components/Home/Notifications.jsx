import { useState } from 'react';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('All');

  const handleSend = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    const notification = {
      id: Date.now(),
      message,
      recipient,
      timestamp: new Date().toISOString()
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    alert(`Notification sent to ${recipient}`);
    setMessage('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Notifications</h2>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Users</option>
              <option value="Farmers">All Farmers</option>
              <option value="Consumers">All Consumers</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your message..."
            />
          </div>

          <button
            onClick={handleSend}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
