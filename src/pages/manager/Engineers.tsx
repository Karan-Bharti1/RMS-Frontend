import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../url';
import ManagerHeader from '../../components/ManagerHeader';
import axios from 'axios';

interface Engineer {
  _id: string;
  username: string;
  skills?: string[];
  maxCapacity: number;
}

interface Assignment {
  allocationPercentage: number;
}

interface EngineerWithCapacity extends Engineer {
  usedCapacity: number;
  availableCapacity: number;
}

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<EngineerWithCapacity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  useEffect(() => {
    // Check if userData exists and has a token
    if (!userData || !userData.token) {
      navigate('/login');
      return;
    }
  }, [navigate, userData]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/engineers`);
        const data = res.data;

        const enrichedData = await Promise.all(
          data.map(async (engineer: any) => {
            try {
              const assignmentRes = await axios.get(`${baseUrl}/engineer/${engineer._id}`);
              const assignments: Assignment[] = Array.isArray(assignmentRes.data) ? assignmentRes.data : [];

              const used = assignments.reduce((sum, a) => sum + (a?.allocationPercentage || 0), 0);
              const available = Math.max(0, engineer.maxCapacity - used);

              return {
                ...engineer,
                usedCapacity: used,
                availableCapacity: available,
              };
            } catch (assignmentError) {
              console.warn(`Failed to fetch assignments for engineer ${engineer._id}:`, assignmentError);
              return {
                ...engineer,
                usedCapacity: 0,
                availableCapacity: engineer.maxCapacity,
              };
            }
          })
        );

        setEngineers(enrichedData);
      } catch (err) {
        console.error('Failed to fetch engineers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.token) {
      fetchEngineers();
    }
  }, [userData?.token]);

  if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading engineers...</div>;

  return (
    <>
      <ManagerHeader />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">👷 Engineers</h2>
        
        {engineers.length === 0 ? (
          <div className="text-center text-gray-600 bg-gray-50 p-8 rounded-lg">
            <p className="text-lg">No engineers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engineers.map((eng) => {
              const percentUsed = eng.maxCapacity > 0 ? Math.round((eng.usedCapacity / eng.maxCapacity) * 100) : 0;
              
              return (
                <div
                  key={eng._id}
                  className="p-5 bg-white border border-indigo-200 rounded-2xl shadow-md space-y-3"
                >
                  <h3 className="text-xl font-semibold text-indigo-800">{eng.username}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Skills:</strong> {eng.skills?.join(', ') || '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Max Capacity:</strong> {eng.maxCapacity}
                  </p>
                  
                  {/* Capacity Bar */}
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Workload</p>
                    <div className="w-full h-4 bg-indigo-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-300"
                        style={{ width: `${Math.min(100, percentUsed)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {eng.usedCapacity} used / {eng.maxCapacity} total — {eng.availableCapacity} available
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Engineers;