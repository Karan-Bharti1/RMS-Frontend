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
            <img
  src="https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  alt="Manager Dashboard"
  className="mx-auto mb-6 max-w-full h-auto rounded-2xl shadow-lg object-cover w-[90%] md:w-[70%] lg:w-[50%]"
/>
      <h1 className="text-2xl font-bold text-blue-700">Engineer Dashboard</h1>
      <p className="mt-4">Welcome, {userData.username}! You are logged in as a {userData.role}.</p>
    </div>
    </>
  );
};

export default EngineerDashboard;
