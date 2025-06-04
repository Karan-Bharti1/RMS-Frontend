import React from 'react';
import EngineerHeader from './EngineerHeader';

interface EngineerDashboardProps {
  userData: {
    username: string;
    role: string;
    userId:string,
    token:string
  };
}

const EngineerDashboard: React.FC<EngineerDashboardProps> = ({ userData }) => {
  return (
    <>
    <EngineerHeader/>
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-blue-700">Engineer Dashboard</h1>
      <p className="mt-4">Welcome, {userData.username}! You are logged in as a {userData.role}.</p>
    </div>
    </>
  );
};

export default EngineerDashboard;
