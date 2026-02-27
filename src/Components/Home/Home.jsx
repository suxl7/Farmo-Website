import { useState, useEffect } from "react";
import axios from "axios";
import farmerIcon from "../../assets/farmer1.png";
import cropIcon from "../../assets/crop.png";
import customerIcon from "../../assets/customer1.png";
import badgeIcon from "../../assets/badge1.png";
import StatCard from "./StatCard";
import { API_BASE_URL } from "../../config/api";
import { API_ENDPOINTS } from "../../config/api";
import SessionData from "../../utils/SessionData";

const STATS_CONFIG = [
  {
    id: "farmers",
    icon: farmerIcon,
    label: "Total Active Farmers",
    color: "from-green-400 to-green-600",
    textColor: "text-green-100",
  },
  {
    id: "products",
    icon: cropIcon,
    label: "Active Products",
    color: "from-blue-400 to-blue-600",
    textColor: "text-blue-100",
  },
  {
    id: "consumers",
    icon: customerIcon,
    label: "Total Active Consumers",
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-100",
  },
  {
    id: "verifications",
    icon: badgeIcon,
    label: "Verification Requests",
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-100",
  },
];

const Home = ({ setActiveSection, setSelectedFarmer }) => {
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    consumers: 0,
    verifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.post(  
          `${API_BASE_URL}${API_ENDPOINTS.DASHBOARD}`,
          {},
          {
            headers: {
              "token": SessionData.getToken(),
              "user-id": SessionData.getUserId(),
              "Content-Type": "application/json",
            }
          }
        );

        console.log("Dashboard data:", data);
        setStats({
          farmers: data.total_farmers || 0,
          products: data.active_products || 0,
          consumers: data.total_consumers || 0,
          verifications: data.verification_requests || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {STATS_CONFIG.map((config) => (
            <StatCard key={config.id} {...config} value={stats[config.id]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
