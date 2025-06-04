import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout } from "react-icons/tb";
const ManagerHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
const navigate=useNavigate()
  const toggleMenu = () => setIsOpen(!isOpen);
const handleLogOut = () => {
  localStorage.removeItem("userData"); 
  navigate("/login");                 
};
  return (
    <header className="bg-gradient-to-r from-blue-100 to-indigo-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="text-xl font-bold text-indigo-800">
          RMS
        </div>

        {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6">

  <NavLink to="/projects" className={({ isActive }) => `text-indigo-700 hover:underline ${isActive ? 'font-semibold' : ''}`}>Projects</NavLink>
  <NavLink to="/engineers" className={({ isActive }) => `text-indigo-700 hover:underline ${isActive ? 'font-semibold' : ''}`}>Engineers</NavLink>
  <NavLink to="/assignments" className={({ isActive }) => `text-indigo-700 hover:underline ${isActive ? 'font-semibold' : ''}`}>Assignments</NavLink>
    <button onClick={handleLogOut} className="block text-indigo-700 "><TbLogout/></button>
</nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-indigo-800 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <NavLink to="/" className="block text-indigo-700 py-1" onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/projects" className="block text-indigo-700 py-1" onClick={toggleMenu}>Projects</NavLink>
          <NavLink to="/engineers" className="block text-indigo-700 py-1" onClick={toggleMenu}>Engineers</NavLink>
          <NavLink to="/assignments" className="block text-indigo-700 py-1" onClick={toggleMenu}>Assignments</NavLink>
        </div>
      )}
    </header>
  );
};

export default ManagerHeader;
