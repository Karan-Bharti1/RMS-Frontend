import React from 'react';
import ManagerHeader from './ManagerHeader';

interface ManagerDashboardProps {
  userData: {
    username: string;
    role: string;
    userId: string;
    token: string;
  };
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData }) => {
  return (
    <>
      <ManagerHeader />
      <div className="p-8 text-center">
        <img
  src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  alt="Manager Dashboard"
  className="mx-auto mb-6 max-w-full h-auto rounded-2xl shadow-lg object-cover w-[90%] md:w-[70%] lg:w-[50%]"
/>
        <h1 className="text-2xl font-bold text-indigo-700">Manager Dashboard</h1>
        <p className="mt-4">Welcome, {userData.username}! You are logged in as a {userData.role}.</p>
      </div>
    </>
  );
};

export default ManagerDashboard;
