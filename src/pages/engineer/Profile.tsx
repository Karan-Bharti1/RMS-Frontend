import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, X, Check } from 'lucide-react';


import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../url';
import EngineerHeader from '../../components/EngineerHeader';
interface User {
  username: string;
  email?: string;
  role?: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
}

interface Assignment {
  allocationPercentage: number;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [availableCapacity, setAvailableCapacity] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>();
 const navigate=useNavigate()
    const storedUserData = localStorage.getItem('userdata');
  const userdata = storedUserData ? JSON.parse(storedUserData) : null;
  useEffect(() => {
    // Check if userData exists and has a token
    if (!userdata || !userdata.token) {
      navigate('/login');
    }
  }, [navigate, userdata]);
  useEffect(() => {
    const fetchUserAndCapacity = async () => {
      const local = localStorage.getItem('userdata');
      const userId = local ? JSON.parse(local)?.userId : null;
      if (!userId) return;

      try {
        const res = await fetch(`${baseUrl}/user/${userId}`);
        const data = await res.json();
        setUserData(data);
        reset(data);
        setSkillsInput(data.skills?.join(', ') || '');

        const assignRes = await fetch(`${baseUrl}/engineer/${userId}`);
        const assignments: Assignment[] = await assignRes.json();
        const totalAllocated = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
        setAvailableCapacity(data.maxCapacity! - (isNaN(totalAllocated)?0:totalAllocated));
      } catch (err) {
        console.error('Failed to fetch profile/capacity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCapacity();
  }, [reset]);

  const onSubmit = async (formData: User) => {
    const local = localStorage.getItem('userdata');
    const userId = local ? JSON.parse(local)?.userId : null;
    const finalData = { ...formData, skills: skillsInput.split(',').map(s => s.trim()) };

    try {
      const res = await fetch(`${baseUrl}/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error('Failed to update user');

      const updated = await res.json();
      setUserData(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const render = (val: string | number | undefined | null) => val ?? '—';
  const capacityUsed = userData?.maxCapacity && availableCapacity != null
    ? userData.maxCapacity - availableCapacity
    : 0;
  const capacityPercent = userData?.maxCapacity
    ? Math.round((capacityUsed / userData.maxCapacity) * 100)
    : 0;

  if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading profile...</div>;

  return (
    <>
      <EngineerHeader />
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-indigo-700">👤 Profile Overview</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm transition"
          >
            <Pencil size={16} /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
          <div><strong>Username:</strong> {render(userData?.username)}</div>
          <div><strong>Email:</strong> {render(userData?.email)}</div>
          <div><strong>Role:</strong> {render(userData?.role)}</div>
          <div><strong>Seniority:</strong> {render(userData?.seniority)}</div>
          <div><strong>Department:</strong> {render(userData?.department)}</div>
          <div><strong>Max Capacity:</strong> {render(userData?.maxCapacity)}</div>
          <div className="col-span-2">
            <strong>Skills:</strong> {userData?.skills?.join(', ') || '—'}
          </div>
        </div>

        {/* Progress Bar */}
        {userData?.maxCapacity && availableCapacity !== null && (
          <div>
            <p className="mt-4 font-medium text-sm text-indigo-700">📊 Workload Allocation</p>
            <div className="w-full bg-indigo-100 h-5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 text-white text-xs text-center font-medium transition-all duration-500"
                style={{ width: `${capacityPercent}%` }}
              >
                {capacityPercent}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {capacityUsed} of {userData.maxCapacity} allocated — {availableCapacity} available
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl border border-indigo-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-indigo-700">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                {...register('username', { required: true })}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded border-indigo-300"
              />
              {errors.username && <p className="text-sm text-red-500">Username is required</p>}

              <input
                type="email"
                {...register('email')}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded border-indigo-300"
              />

              <select {...register('role')} className="w-full px-3 py-2 border rounded border-indigo-300">
                <option value="">Select Role</option>
                <option value="engineer">Engineer</option>
                <option value="manager">Manager</option>
              </select>

              <select {...register('seniority')} className="w-full px-3 py-2 border rounded border-indigo-300">
                <option value="">Select Seniority</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>

              <input
                type="text"
                {...register('department')}
                placeholder="Department"
                className="w-full px-3 py-2 border rounded border-indigo-300"
              />

              <input
                type="number"
                {...register('maxCapacity')}
                placeholder="Max Capacity"
                className="w-full px-3 py-2 border rounded border-indigo-300"
              />

              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skillsInput}
                onChange={(e) => {
                  setSkillsInput(e.target.value);
                  setValue('skills', e.target.value.split(',').map(s => s.trim()));
                }}
                className="w-full px-3 py-2 border rounded border-indigo-300"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  <Check size={16} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
