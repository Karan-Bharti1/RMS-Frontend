
import './App.css';

import ManagerDashboard from './components/ManagerDashboard';
import EngineerDashboard from './components/EngineerDashboard';

function App() {
  const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
console.log(userData)
  const renderDashboard = () => {
    if (!userData) {
      return (
        <div className="text-center mt-10 text-red-600">
          No user logged in. Please login first.
        </div>
      );
    }

    if (userData.role === 'manager') {
      return <ManagerDashboard userData={userData}/>;
    } else if (userData.role === 'engineer') {
      return <EngineerDashboard userData={userData} />;
    } else {
      return (
        <div className="text-center mt-10 text-red-600">
          Invalid role detected.
        </div>
      );
    }
  };

  return (
    <>
    
      {renderDashboard()}
    </>
  );
}

export default App;
