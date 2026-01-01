import { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Farmers from './Farmers';
import Consumers from './Consumers';
import Products from './Products';
import Orders from './Orders';
import Notifications from './Notifications';
import Profile from './Profile';
import AddUser from './AddUser';

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    if (section !== 'farmers') {
      setSelectedFarmer(null);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} setSelectedFarmer={setSelectedFarmer} />;
      case 'farmers':
        return <Farmers selectedFarmer={selectedFarmer} />;
      case 'consumers':
        return <Consumers />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile onLogout={onLogout} />;
      case 'adduser':
        return <AddUser />;
      default:
        return <Home setActiveSection={setActiveSection} setSelectedFarmer={setSelectedFarmer} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeSection={activeSection} setActiveSection={handleSetActiveSection} />
      {renderSection()}
    </div>
  );
};

export default Dashboard;
