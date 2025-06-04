import ManagerHeader from '@/components/ManagerHeader';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { baseUrl } from '@/url';
import { FiX } from 'react-icons/fi';
import { useProjects } from '@/contexts/projectContext';
import { useNavigate } from 'react-router-dom';
interface ProjectFormInputs {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string;
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

const Projects: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [searchStatus, setSearchStatus] = useState('');
  const navigate=useNavigate()
  


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormInputs>();

  const storedUserData = localStorage.getItem('userdata');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
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

  const onSubmit: SubmitHandler<ProjectFormInputs> = async (data) => {
    const projectData = {
      ...data,
      managerId,
      requiredSkills: data.requiredSkills
        ? data.requiredSkills.split(',').map((skill) => skill.trim())
        : [],
    };

    try {
      if (editMode && projectToEdit) {
        await axios.post(`${baseUrl}/update/${projectToEdit._id}`, projectData);
      } else {
        const response = await axios.post(`${baseUrl}/projects`, projectData);
        addProject(response.data);
      }

      setShowForm(false);
      setEditMode(false);
      setProjectToEdit(null);
      reset();
      fetchProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
    }
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
                    <p><strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                    <p><strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
                    <p><strong>Team Size:</strong> {project.teamSize}</p>
                    <p><strong>Skills:</strong> {project.requiredSkills?.join(', ') || 'N/A'}</p>
                    <p><strong>Manager:</strong> {project.managerId?.username || 'Not Assigned'}</p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setProjectToEdit(project);
                        reset({
                          name: project.name,
                          description: project.description,
                          startDate: project.startDate?.slice(0, 10),
                          endDate: project.endDate?.slice(0, 10),
                          requiredSkills: project.requiredSkills.join(', '),
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
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl relative">
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
                  <label className="block font-medium">Project Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="border p-2 rounded w-full"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block font-medium">Description</label>
                  <textarea
                    {...register('description')}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium">Start Date</label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Start date is required' })}
                      className="border p-2 rounded w-full"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">End Date</label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium">Required Skills (comma separated)</label>
                  <input
                    {...register('requiredSkills')}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium">Team Size</label>
                  <input
                    type="number"
                    {...register('teamSize', {
                      required: 'Team size is required',
                      min: { value: 1, message: 'Minimum team size is 1' },
                    })}
                    className="border p-2 rounded w-full"
                  />
                  {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize.message}</p>}
                </div>

                <div>
                  <label className="block font-medium">Status</label>
                  <select {...register('status')} className="border p-2 rounded w-full">
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-indigo-400 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
                >
                  {editMode ? 'Update Project' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
