import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiEdit2 } from 'react-icons/fi';
import ManagerHeader from '@/components/ManagerHeader';

import { useProjects } from '@/contexts/projectContext';
import { useEngineers } from '@/contexts/userContext';
import { useAssignments } from '@/contexts/assignmentContext';

interface AssignmentFormInputs {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: 'Developer' | 'Tech Lead' | 'QA' | 'Manager';
}

const roles = ['Developer', 'Tech Lead', 'QA', 'Manager'];

const Assignment: React.FC = () => {
  const { assignments, createAssignment, updateAssignment } = useAssignments();
  const { projects } = useProjects();
  const { engineers } = useEngineers();
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentType | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormInputs>();

  const onSubmit = async (data: AssignmentFormInputs) => {
    if (editingAssignment) {
      // Update existing assignment
      await updateAssignment(editingAssignment._id, data);
    } else {
      // Create new assignment
      await createAssignment(data);
    }
    closeForm();
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

  return (
    <>
      <ManagerHeader />
      <div className="relative p-4">
        {/* Button to open create form */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateForm}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Create Assignment
          </button>
        </div>

        {/* Assignment Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment: AssignmentType) => {
            const engineer = engineers.find(e => e._id === assignment.engineerId);
            const project = projects.find(p => p._id === assignment.projectId);
            return (
              <div key={assignment._id} className="border p-4 rounded-lg shadow bg-white space-y-1 relative">
                {/* Edit button */}
                <button
                  onClick={() => openEditForm(assignment)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Edit assignment"
                >
                  <FiEdit2 size={18} />
                </button>

                <h3 className="text-lg font-semibold text-indigo-600 pr-8">{assignment.role}</h3>
                <p><strong>Engineer:</strong> {engineer ? engineer.name || engineer.username : assignment.engineerId}</p>
                <p><strong>Project:</strong> {project ? project.name : assignment.projectId}</p>
                <p><strong>Allocation:</strong> {assignment.allocationPercentage}%</p>
                <p><strong>Start:</strong> {new Date(assignment.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            );
          })}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                aria-label="Close form"
              >
                <FiX size={24} />
              </button>

              <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-medium">Engineer</label>
                  <select
                    {...register('engineerId', { required: 'Engineer is required' })}
                    className="border p-2 rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>Select engineer</option>
                    {engineers.map((eng) => (
                      <option key={eng._id} value={eng._id}>
                        {eng.name || eng.username}
                      </option>
                    ))}
                  </select>
                  {errors.engineerId && <p className="text-red-600 text-sm mt-1">{errors.engineerId.message}</p>}
                </div>

                <div>
                  <label className="block font-medium">Project</label>
                  <select
                    {...register('projectId', { required: 'Project is required' })}
                    className="border p-2 rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.projectId && <p className="text-red-600 text-sm mt-1">{errors.projectId.message}</p>}
                </div>

                <div>
                  <label className="block font-medium">Role</label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="border p-2 rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium">Start Date</label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Start date is required' })}
                      className="border p-2 rounded w-full"
                    />
                    {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>}
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
                  <label className="block font-medium">Allocation Percentage</label>
                  <input
                    type="number"
                    {...register('allocationPercentage', {
                      required: 'Allocation is required',
                      min: { value: 0, message: 'Min 0%' },
                      max: { value: 100, message: 'Max 100%' },
                    })}
                    className="border p-2 rounded w-full"
                    placeholder="e.g., 50"
                  />
                  {errors.allocationPercentage && <p className="text-red-600 text-sm mt-1">{errors.allocationPercentage.message}</p>}
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Assignment;