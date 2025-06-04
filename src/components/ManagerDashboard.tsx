import React from 'react';
import ManagerHeader from './ManagerHeader';

interface ManagerDashboardProps {
  userData: {
    username: string;
    role: string;
    userId:string,
    token:string
  };
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData }) => {
  return (
    <>
    <ManagerHeader/>
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-indigo-700">Manager Dashboard</h1>
      <p className="mt-4">Welcome, {userData.username}! You are logged in as a {userData.role}.</p>
    </div>
    </>
  );
};

export default ManagerDashboard;
