import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EngineerHeader from '@/components/EngineerHeader';
import { baseUrl } from '@/url';

interface User {
  username: string;
  email?: string;
  role?: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const local = localStorage.getItem('userdata');
      const userId = local ? JSON.parse(local)?.userId : null;
      if (!userId) return;

      try {
        const res = await fetch(`${baseUrl}/user/${userId}`);
        const data = await res.json();
        setUserData(data);
        reset(data);
        setSkillsInput(data.skills?.join(', ') || '');
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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

  

  const render = (val: any) => val ?? '____';

  if (loading) return <div className="p-4 text-lg">Loading profile...</div>;
  return (
    <>
    { (loading ||!loading) && <EngineerHeader />}
      <div className="max-w-md mx-auto mt-10 p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-md space-y-3">
        <h2 className="text-2xl font-bold text-indigo-700 text-center">User Profile</h2>

        <p><strong>Username:</strong> {render(userData?.username)}</p>
        <p><strong>Email:</strong> {render(userData?.email)}</p>
        <p><strong>Role:</strong> {render(userData?.role)}</p>
        <p><strong>Seniority:</strong> {render(userData?.seniority)}</p>
        <p><strong>Department:</strong> {render(userData?.department)}</p>
        <p><strong>Max Capacity:</strong> {render(userData?.maxCapacity)}</p>
        <p><strong>Skills:</strong> {userData?.skills?.join(', ') || '____'}</p>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Update Profile</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  {...register('username', { required: true })}
                  placeholder="Username"
                  className="w-full px-3 py-2 border rounded border-indigo-300"
                />
                {errors.username && <p className="text-sm text-red-500">Username is required</p>}
              </div>

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
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Save
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
