
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SessionData from '../../utils/SessionData';

const Navbar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const userType = SessionData.getUserType();
  console.log('userType:', userType, 'isSuperAdmin:', userType?.toUpperCase() === 'SUPERADMIN');
  const isSuperAdmin = userType?.toUpperCase() === 'SUPERADMIN';

  const menuItems = [
    { path: '/dashboard/home', label: 'Home', iconImg: '/house.png' },
    { path: '/dashboard/products', label: 'Products', iconImg: '/crop.png' },
    { path: '/dashboard/orders', label: 'Orders', iconImg: '/order.png' },
    { path: '/dashboard/add-user', label: 'Add User', iconImg: '/addU.png' },
    { path: '/dashboard/profile', label: 'Profile', iconImg: '/profile.png' }
  ];

  const userMenuItems = [
    { path: '/dashboard/farmers', label: 'Farmers', iconImg: '/farmer1.png' },
    { path: '/dashboard/consumers', label: 'Consumers', iconImg: '/consumer.png' },
    ...(isSuperAdmin ? [{ path: '/dashboard/admins', label: 'Admins', iconImg: '/personnel.png' }] : [])
  ];

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition flex items-center ${
      isActive
        ? 'bg-green-500 text-white'
        : 'text-gray-700 hover:bg-green-50'
    }`;

  return (
    <nav className="bg-gradient-to-br from-gray-400 to-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
              <img src="/farmo-1.png" alt="Farmo logo" className="w-full h-full rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-green-800">Farmo</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLink
              to="/dashboard/home"
              className={linkClasses}
              end
            >
              <span className="mr-2">
                <img src="/house.png" alt="Home" className="w-5 h-5" />
              </span>
              Home
            </NavLink>
            
            {/* Users Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
                className="px-4 py-2 rounded-lg font-medium transition flex items-center text-gray-700 hover:bg-green-50"
              >
                <span className="mr-2"></span>
                <img src="/group.png" alt="Users" className="w-5 h-5" />
                <span className="mr-2"></span>
                       Users
                <span className="ml-1">{isUsersDropdownOpen ? '▲' : '▼'}</span>
              </button>
              
              {isUsersDropdownOpen && (
                <div className="absolute top-full mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[150px]">
                  {userMenuItems.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsUsersDropdownOpen(false)}
                      className={({ isActive }) => `px-4 py-2 flex items-center hover:bg-gray-100 ${
                        isActive ? 'bg-green-50 text-green-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-2">
                        <img src={item.iconImg} alt={item.label} className="w-5 h-5" />
                      </span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {menuItems.slice(1).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClasses}
              >
                <span className="mr-2">
                  {item.iconImg ? (
                    <img src={item.iconImg} alt={item.label} className="w-5 h-5" />
                  ) : (
                    item.icon
                  )}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <NavLink
              to="/dashboard/home"
              onClick={() => setIsMobileMenuOpen(false)}
              className={linkClasses}
              end
            >
              <span className="mr-2">
                <img src="/house.png" alt="Home" className="w-5 h-5 inline-block" />
              </span>
              Home
            </NavLink>
            
            {/* Mobile Users Section */}
            <div className="border-t pt-2 mt-2">
              <p className="px-4 py-2 text-sm font-semibold text-gray-600">Users</p>
              {userMenuItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClasses}
                >
                  <span className="mr-2">
                    <img src={item.iconImg} alt={item.label} className="w-5 h-5 inline-block" />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>

            {menuItems.slice(1).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={linkClasses}
              >
                <span className="mr-2">
                  {item.iconImg ? (
                    <img src={item.iconImg} alt={item.label} className="w-5 h-5 inline-block" />
                  ) : (
                    item.icon
                  )}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
