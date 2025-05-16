import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../libs/axios';

const UserProfile = () => {
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser.name || '',
    phone: authUser.phone || '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        ...(formData.password && { password: formData.password }),  
      };

      const res = await axiosInstance.put(`/auth/profile/${authUser._id}`, updatedData);
      toast.success(res.data?.msg);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-[#1E1E2E] rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
          <User size={28} /> {`${authUser.name}'s Profile`}
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span className="text-gray-300">{authUser.email}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
