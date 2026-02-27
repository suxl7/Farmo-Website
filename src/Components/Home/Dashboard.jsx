
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navbar onLogout={onLogout} />

      {/* Render nested dashboard pages */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
