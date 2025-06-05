import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiEdit2 } from 'react-icons/fi';
import ManagerHeader from '@/components/ManagerHeader';

import { useProjects } from '@/contexts/projectContext';
import { useEngineers } from '@/contexts/userContext';
import { useAssignments } from '@/contexts/assignmentContext';
import { useNavigate } from 'react-router-dom';
interface AssignmentFormInputs {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: 'Developer' | 'Tech Lead' | 'QA' | 'Manager';
}

interface AssignmentType {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: 'Developer' | 'Tech Lead' | 'QA' | 'Manager';
}

const roles = ['Developer', 'Tech Lead', 'QA', 'Manager'];

const Assignment: React.FC = () => {
  const assignmentContext = useAssignments();
  const projectContext = useProjects();
  const engineerContext = useEngineers();

  // Safely extract data with fallbacks
  const assignments = assignmentContext?.assignments || [];
  const createAssignment = assignmentContext?.createAssignment || (() => {});
  const updateAssignment = assignmentContext?.updateAssignment || (() => {});
  const projects = projectContext?.projects || [];
  const engineers = engineerContext?.engineers || [];

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentType | null>(null);
 const navigate=useNavigate()
    const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  useEffect(() => {
    // Check if userData exists and has a token
    if (!userData || !userData.token) {
      navigate('/login');
    }
  }, [navigate, userData]);
  


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormInputs>();

  const onSubmit = async (data: AssignmentFormInputs) => {
    try {
      console.log('Submitting assignment data:', data);
      if (editingAssignment) {
        // Update existing assignment
        await updateAssignment(editingAssignment._id, data);
      } else {
        // Create new assignment
        await createAssignment(data);
      }
      closeForm();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAssignment(null);
    reset();
  };

  const openCreateForm = () => {
    setEditingAssignment(null);
    setShowForm(true);
    reset();
  };

  const openEditForm = (assignment: AssignmentType) => {
    setEditingAssignment(assignment);
    setShowForm(true);
    
    // Pre-fill form with existing data
    setValue('engineerId', assignment.engineerId);
    setValue('projectId', assignment.projectId);
    setValue('allocationPercentage', assignment.allocationPercentage);
    setValue('startDate', assignment.startDate.split('T')[0]); // Format date for input
    setValue('endDate', assignment.endDate ? assignment.endDate.split('T')[0] : '');
    setValue('role', assignment.role);
  };

  // Enhanced helper function to safely get engineer name
  const getEngineerName = (engineerId: string) => {
    console.log(`Getting engineer name for ID: ${engineerId}`);
    
    if (!engineerId) {
      console.log('No engineer ID provided');
      return 'No Engineer Assigned';
    }
    
    if (!Array.isArray(engineers) || engineers.length === 0) {
      console.log('Engineers array is empty or not an array');
      return `Engineer ID: ${engineerId}`;
    }
    
    // Try multiple ways to find the engineer
    let engineer = engineers.find(e => e && e._id === engineerId);
    
    if (!engineer) {
      // Try with id field instead of _id
      engineer = engineers.find(e => e && e.id === engineerId);
    }
    
    if (!engineer) {
      // Try string comparison (in case of type mismatch)
      engineer = engineers.find(e => e && String(e._id) === String(engineerId));
    }
    
    if (!engineer) {
      // Try with userId field (if that's what's being used)
      engineer = engineers.find(e => e && e.userId === engineerId);
    }
    
    if (!engineer) {
      console.log(`Engineer not found for ID: ${engineerId}`);
      console.log('Available engineers:', engineers.map(e => ({ 
        _id: e?._id, 
        id: e?.id, 
        userId: e?.userId,
        name: e?.name, 
        username: e?.username 
      })));
      return `Engineer ID: ${engineerId}`;
    }
    
    console.log('Found engineer:', engineer);
    
    // Get the display name
    const displayName = engineer.name || engineer.username || engineer.firstName || engineer.email || 'Unknown Engineer';
    console.log(`Engineer display name: ${displayName}`);
    
    return String(displayName);
  };

  // Enhanced helper function to safely get project name
  const getProjectName = (projectId: string) => {
    console.log(`Getting project name for ID: ${projectId}`);
    
    if (!projectId) {
      console.log('No project ID provided');
      return 'No Project Assigned';
    }
    
    if (!Array.isArray(projects) || projects.length === 0) {
      console.log('Projects array is empty or not an array');
      return `Project ID: ${projectId}`;
    }
    
    // Try multiple ways to find the project
    let project = projects.find(p => p && p._id === projectId);
    
    if (!project) {
    
      project = projects.find(p => p && p.id === projectId);
    }
    
    if (!project) {
      // Try string comparison (in case of type mismatch)
      project = projects.find(p => p && String(p._id) === String(projectId));
    }
    
    if (!project) {
      console.log(`Project not found for ID: ${projectId}`);
      console.log('Available projects:', projects.map(p => ({ 
        _id: p?._id, 
        id: p?.id, 
        name: p?.name, 
        title: p?.title 
      })));
      return `Project ID: ${projectId}`;
    }
    
    console.log('Found project:', project);
    
    // Get the display name
    const displayName = project.name || project.title || 'Unknown Project';
    console.log(`Project display name: ${displayName}`);
    
    return String(displayName);
  };

  // Helper function to safely format date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <>
      <ManagerHeader />
      <div className="relative p-4">
        {/* Button to open create form */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateForm}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            + Create Assignment
          </button>
        </div>

       
        {/* Assignment Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(assignments) && assignments.length > 0 ? (
            assignments.map((assignment) => {
              // Ensure assignment is a valid object
              if (!assignment || typeof assignment !== 'object' || !assignment._id) {
                return null;
              }

              const engineerName = getEngineerName(assignment.engineerId._id);
              const projectName = getProjectName(assignment.projectId);

              return (
                <div key={assignment._id} className="border p-4 rounded-lg shadow bg-white space-y-2 relative">
                  {/* Edit button */}
                  <button
                    onClick={() => openEditForm(assignment)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-indigo-600 transition-colors"
                    aria-label="Edit assignment"
                  >
                    <FiEdit2 size={18} />
                  </button>

                  <h3 className="text-lg font-semibold text-indigo-600 pr-8">
                    {String(assignment.role || 'Unknown Role')}
                  </h3>
                  
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-gray-700">Engineer:</span>{' '}
                      <span className="text-gray-900" title={`Engineer ID: ${assignment.engineerId}`}>
                        {engineerName}
                      </span>
                    </p>
                    
                    <p>
                      <span className="font-medium text-gray-700">Project:</span>{' '}
                      <span className="text-gray-900" title={`Project ID: ${assignment.projectId}`}>
                        {projectName}
                      </span>
                    </p>
                    
                    <p>
                      <span className="font-medium text-gray-700">Allocation:</span>{' '}
                      <span className="text-gray-900">{String(assignment.allocationPercentage || 0)}%</span>
                    </p>
                    
                    <p>
                      <span className="font-medium text-gray-700">Start:</span>{' '}
                      <span className="text-gray-900">{formatDate(assignment.startDate)}</span>
                    </p>
                    
                    <p>
                      <span className="font-medium text-gray-700">End:</span>{' '}
                      <span className="text-gray-900">
                        {assignment.endDate ? formatDate(assignment.endDate) : 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              );
            }).filter(Boolean) // Remove any null entries
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {assignments === null || assignments === undefined ? (
                <div>
                  <p>Loading assignments...</p>
                  <div className="mt-2 text-xs">
                    Engineers: {engineers?.length || 0} loaded<br/>
                    Projects: {projects?.length || 0} loaded
                  </div>
                </div>
              ) : (
                <p>No assignments found. Create your first assignment to get started.</p>
              )}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                aria-label="Close form"
              >
                <FiX size={24} />
              </button>

              <h2 className="text-xl font-semibold text-indigo-600 mb-6 pr-8">
                {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engineer
                  </label>
                  <select
                    {...register('engineerId', { required: 'Engineer is required' })}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Select engineer</option>
                    {Array.isArray(engineers) && engineers.map((eng) => {
                      if (!eng || (!eng._id && !eng.id)) return null;
                      const id = eng._id || eng.id;
                      const displayName = eng.name || eng.username || eng.firstName || eng.email || 'Unknown Engineer';
                      return (
                        <option key={id} value={id}>
                          {String(displayName)}
                        </option>
                      );
                    }).filter(Boolean)}
                  </select>
                  {errors.engineerId && (
                    <p className="text-red-600 text-sm mt-1">{errors.engineerId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <select
                    {...register('projectId', { required: 'Project is required' })}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Select project</option>
                    {Array.isArray(projects) && projects.map((project) => {
                      if (!project || (!project._id && !project.id)) return null;
                      const id = project._id || project.id;
                      const displayName = project.name || project.title || 'Unnamed Project';
                      return (
                        <option key={id} value={id}>
                          {String(displayName)}
                        </option>
                      );
                    }).filter(Boolean)}
                  </select>
                  {errors.projectId && (
                    <p className="text-red-600 text-sm mt-1">{errors.projectId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Start date is required' })}
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.startDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('allocationPercentage', {
                      required: 'Allocation is required',
                      min: { value: 0, message: 'Minimum allocation is 0%' },
                      max: { value: 100, message: 'Maximum allocation is 100%' },
                      valueAsNumber: true,
                    })}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 50"
                  />
                  {errors.allocationPercentage && (
                    <p className="text-red-600 text-sm mt-1">{errors.allocationPercentage.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Assignment;