import { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Farmers from './Farmers';
import Profile from './Profile';
import AddUser from './AddUser';

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} setSelectedFarmer={setSelectedFarmer} />;
      case 'farmers':
        return <Farmers selectedFarmer={selectedFarmer} />;
      case 'consumers':
        return <div className="p-6"><h2 className="text-2xl font-bold">Consumers Section</h2></div>;
      case 'products':
        return <div className="p-6"><h2 className="text-2xl font-bold">Products Section</h2></div>;
      case 'orders':
        return <div className="p-6"><h2 className="text-2xl font-bold">Orders Section</h2></div>;
      case 'notifications':
        return <div className="p-6"><h2 className="text-2xl font-bold">Notifications Section</h2></div>;
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
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderSection()}
    </div>
  );
};

export default Dashboard;
