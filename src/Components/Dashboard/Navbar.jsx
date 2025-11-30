import { useState } from 'react';

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'farmers', label: 'Farmers', icon: '👨‍🌾' },
    { id: 'consumers', label: 'Consumers', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🌾' },
    { id: 'userlist', label: 'Userlist', icon: '📋' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
              🌱
            </div>
            <h1 className="text-2xl font-bold text-green-700">Farmo</h1>
          </div>

          <div className="hidden md:flex space-x-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeSection === item.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  activeSection === item.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
