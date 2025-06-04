import './App.css';
import ManagerDashboard from './components/ManagerDashboard';
import EngineerDashboard from './components/EngineerDashboard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  
  // Get user data first
  const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  useEffect(() => {
    // Check if userData exists and has a token
    if (!userData || !userData.token) {
      navigate('/login');
    }
  }, [navigate, userData]);

  // Early return if no user data to prevent rendering errors
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userData.role === 'manager' ? (
        <ManagerDashboard userData={userData} />
      ) : userData.role === 'engineer' ? (
        <EngineerDashboard userData={userData} />
      ) : (
        <div className="text-center mt-10 text-red-600">
          Invalid role detected.
        </div>
      )}
    </>
  );
}

export default App;