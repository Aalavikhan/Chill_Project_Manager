import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 rounded-xl shadow-2xl border border-gray-700/50 p-6 w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 font-medium mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 border border-gray-600/50 placeholder-gray-500"
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 border border-gray-600/50 placeholder-gray-500 resize-none"
              placeholder="Enter project description (optional)"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal; 