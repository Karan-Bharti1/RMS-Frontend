import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/projectContext';
import { baseUrl } from '../../url';
import ManagerHeader from '../../components/ManagerHeader';

interface ProjectFormInputs {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string;
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

// Define the Project interface to match your data structure
interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: {
    _id: string;
    username?: string;
  } | string;
}

// Define UserData interface
interface UserData {
  token: string;
  userId: string;
username:string;
  role: 'manager' | 'engineer';
}

const Projects: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormInputs>();

  // Properly type userData
  const storedUserData = localStorage.getItem('userdata');
  const userData: UserData | null = storedUserData ? JSON.parse(storedUserData) : null;
  const managerId = userData?.userId || '';

  useEffect(() => {
    // Check if userData exists and has a token
    if (!userData || !userData.token) {
      navigate('/login');
    }
  }, [navigate, userData]);

  const { projects, fetchProjects, addProject } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = searchStatus
    ? projects.filter((project) => project.status.toLowerCase().includes(searchStatus.toLowerCase()))
    : projects;

  const onSubmit: SubmitHandler<ProjectFormInputs> = async (data): Promise<void> => {
    const projectData = {
      ...data,
      managerId,
      requiredSkills: data.requiredSkills
        ? data.requiredSkills.split(',').map((skill) => skill.trim())
        : [],
    };

    try {
      if (editMode && projectToEdit) {
        // Fixed: Use PUT method for updates and correct endpoint
        await axios.put(`${baseUrl}/projects/update/${projectToEdit._id}`, projectData);
      } else {
        const response = await axios.post(`${baseUrl}/projects`, projectData);
        addProject(response.data);
      }

      setShowForm(false);
      setEditMode(false);
      setProjectToEdit(null);
      reset();
      await fetchProjects(); // Wait for fetch to complete
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  // Helper function to safely format date
  const formatDate = (dateString: string | undefined): string => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Helper function to get manager name
  const getManagerName = (managerId: string | { _id: string; username?: string }): string => {
    if (typeof managerId === 'object' && managerId !== null) {
      return managerId.username || 'Not Assigned';
    }
    return 'Not Assigned';
  };

  return (
    <>
      <ManagerHeader />
      <div className="relative p-4">
        {/* Top bar with Search and Add */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by status..."
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-60"
          />
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setProjectToEdit(null);
              reset();
            }}
            className="bg-indigo-400 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
          >
            + Add Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="mt-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-500 text-lg mt-10">
              No matching projects found.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div key={project._id} className="border p-5 rounded-2xl shadow-lg bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl text-indigo-600">{project.name}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-600' :
                      project.status === 'planning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-700">{project.description}</p>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Start:</strong> {formatDate(project.startDate)}</p>
                    <p><strong>End:</strong> {formatDate(project.endDate)}</p>
                    <p><strong>Team Size:</strong> {project.teamSize}</p>
                    <p><strong>Skills:</strong> {project.requiredSkills?.join(', ') || 'N/A'}</p>
                    <p><strong>Manager:</strong> {getManagerName(project.managerId)}</p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setProjectToEdit(project);
                        reset({
                          name: project.name,
                          description: project.description,
                          startDate: project.startDate?.slice(0, 10) || '',
                          endDate: project.endDate?.slice(0, 10) || '',
                          requiredSkills: project.requiredSkills?.join(', ') || '',
                          teamSize: project.teamSize,
                          status: project.status,
                        });
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Popup */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                  setProjectToEdit(null);
                  reset();
                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
              >
                <FiX size={24} />
              </button>

              <h2 className="text-xl font-semibold text-indigo-500 mb-4">
                {editMode ? 'Edit Project' : 'Add New Project'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter project name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register('description')}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Enter project description"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Start date is required' })}
                      className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Required Skills <span className="text-sm text-gray-500">(comma separated)</span>
                  </label>
                  <input
                    {...register('requiredSkills')}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    {...register('teamSize', {
                      required: 'Team size is required',
                      min: { value: 1, message: 'Minimum team size is 1' },
                      valueAsNumber: true,
                    })}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter team size"
                  />
                  {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize.message}</p>}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    {...register('status')} 
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-400 text-white px-4 py-2 rounded hover:bg-indigo-500 transition font-medium"
                  >
                    {editMode ? 'Update Project' : 'Create Project'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditMode(false);
                      setProjectToEdit(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium"
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

export default Projects;