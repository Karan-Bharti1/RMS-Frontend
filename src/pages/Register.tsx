
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../url';


type Role = 'engineer' | 'manager';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>('engineer');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        console.log('Registration successful');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">RMS</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Role</option>
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Register
          </button>
        </div>

        <p className="text-center mt-4">
          Back to{' '}
          <Link
            to="/login"
            className="text-blue-500 hover:text-red-500 hover:underline"
          >
            Login?
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
