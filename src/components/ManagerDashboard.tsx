import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ManagerHeader from './ManagerHeader';
import { baseUrl } from '../url';




ChartJS.register(ArcElement, Tooltip, Legend);
interface ManagerDashboardProps {
  userData: {
    username: string;
    role: string;
    userId: string;
    token: string;
  };
}
interface Engineer {
  username: string;
  skills: string[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData }) => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await fetch(`${baseUrl}/engineers`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid response');
        setEngineers(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch engineers');
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  const getSkillDistribution = () => {
    const skillCounts: Record<string, number> = {};
    engineers.forEach((eng) => {
      eng.skills?.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return {
      labels: Object.keys(skillCounts),
      datasets: [
        {
          label: 'Skill Distribution with team',
          data: Object.values(skillCounts),
          backgroundColor: [
            '#6366f1', '#f59e0b', '#10b981', '#ef4444',
            '#3b82f6', '#8b5cf6', '#f97316', '#14b8a6',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <>
      <ManagerHeader />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-8">
          Manager Dashboard 
        </h1>
      <div className="p-8 text-center">
        <img
  src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  alt="Manager Dashboard"
  className="mx-auto mb-6 max-w-full h-auto rounded-2xl shadow-lg object-cover w-[90%] md:w-[70%] lg:w-[50%]"
/>
        <h1 className="text-2xl font-bold text-indigo-700">Manager Dashboard</h1>
        <p className="mt-4">Welcome, {userData.username}! You are logged in as a {userData.role}.</p>
      </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-center text-indigo-600 mb-4">
              Skill Distribution
            </h2>
            <div className="relative h-[400px]">
              <Pie
                data={getSkillDistribution()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManagerDashboard;
