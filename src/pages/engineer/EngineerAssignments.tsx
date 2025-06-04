import React, { useEffect, useState } from 'react';
import EngineerHeader from '@/components/EngineerHeader';
import { baseUrl } from '@/url';
import { useNavigate } from 'react-router-dom';
interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: string;
}

const EngineerAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
 const navigate=useNavigate()
    const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  useEffect(() => {
    // Check if userData exists and has a token
    if (!userData || !userData.token) {
      navigate('/login');
    }
  }, [navigate, userData]);
  useEffect(() => {
    const fetchAssignments = async () => {
      const local = localStorage.getItem('userdata');
      const userId = local ? JSON.parse(local)?.userId : null;
      if (!userId) return;

      try {
        const res = await fetch(`${baseUrl}/engineer/${userId}`);
        const data = await res.json();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const determineStatus = (start: string, end?: string): 'planning' | 'active' | 'completed' => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (startDate > now && (!endDate || endDate > now)) return 'planning';
    if (endDate && endDate < now) return 'completed';
    return 'active';
  };

  const renderAssignments = (status: 'planning' | 'active' | 'completed') => {
    const filtered = assignments.filter(a => determineStatus(a.startDate, a.endDate) === status);

    if (filtered.length === 0) {
      return <p className="text-sm text-gray-500 italic">No assignments in this section</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map(assign => (
          <div
            key={assign._id}
            className="bg-white border border-indigo-200 rounded-2xl p-4 shadow hover:shadow-md transition"
          >
            <h4 className="text-indigo-600 font-semibold text-lg mb-1">Project ID: {assign.projectId}</h4>
            <p className="text-gray-700"><span className="font-medium">Role:</span> {assign.role}</p>
            <p className="text-gray-700"><span className="font-medium">Allocation:</span> {assign.allocationPercentage}%</p>
            <p className="text-gray-700"><span className="font-medium">Start:</span> {new Date(assign.startDate).toLocaleDateString()}</p>
            {assign.endDate && (
              <p className="text-gray-700"><span className="font-medium">End:</span> {new Date(assign.endDate).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-500 text-lg font-medium">Loading assignments...</p>
      </div>
    );
  }

  return (
    <>
      <EngineerHeader />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <h2 className="text-3xl font-bold text-indigo-700 text-center">Engineer Assignments</h2>

        <section>
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">To Do</h3>
          {renderAssignments('planning')}
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Current</h3>
          {renderAssignments('active')}
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Done</h3>
          {renderAssignments('completed')}
        </section>
      </div>
    </>
  );
};

export default EngineerAssignments;
