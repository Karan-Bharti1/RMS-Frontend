import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../url';

type Role = 'engineer' | 'manager';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>('engineer');
const navigate=useNavigate()
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful', data);

   
   
localStorage.setItem(
      'userdata',
      JSON.stringify({
        token: data.token,
        username: data.user.username,
        userId: data.user._id,
        role: data.user.role,
      })
    );
    navigate('/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">RMS</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />



          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </div>
        <p className='text-center'>Don't have an account <Link className='text-blue-500 hover:text-red-500 hover:underline' to={"/register"}>Register ?</Link></p>
      </form>
      
    </main>
  );
};

export default Login;
