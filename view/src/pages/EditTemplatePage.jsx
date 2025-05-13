import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../libs/axios';
import { Plus, Minus, Save, ArrowLeft, X, PlusCircle } from 'lucide-react';

const EditTemplatePage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: 'General',
    visibility: 'Private',
    structure: {
      tasks: []
    }
  });

  const categories = ['Development', 'Marketing', 'Design', 'HR', 'General', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['To Do', 'In Progress', 'Review', 'Complete'];
  const assigneeTypes = ['Project Manager', 'Developer', 'Designer', 'Tester', 'Unassigned'];

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/templates/single/${templateId}`);
        setTemplate(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to load template');
        navigate('/project-template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...template.structure.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const handleSubtaskChange = (taskIndex, subtaskIndex, field, value) => {
    const updatedTasks = [...template.structure.tasks];
    const updatedSubtasks = [...updatedTasks[taskIndex].subtasks];
    
    updatedSubtasks[subtaskIndex] = {
      ...updatedSubtasks[subtaskIndex],
      [field]: value
    };

    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      subtasks: updatedSubtasks
    };

    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const addTask = () => {
    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: [
          ...prev.structure.tasks,
          {
            title: '',
            description: '',
            priority: 'Medium',
            status: 'To Do',
            estimatedHours: 0,
            tags: [],
            assigneeType: 'Unassigned',
            subtasks: []
          }
        ]
      }
    }));
  };

  const removeTask = (index) => {
    const updatedTasks = [...template.structure.tasks];
    updatedTasks.splice(index, 1);
    
    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const addSubtask = (taskIndex) => {
    const updatedTasks = [...template.structure.tasks];
    
    if (!updatedTasks[taskIndex].subtasks) {
      updatedTasks[taskIndex].subtasks = [];
    }
    
    updatedTasks[taskIndex].subtasks.push({
      title: '',
      description: ''
    });

    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const removeSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = [...template.structure.tasks];
    updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    
    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const handleTagChange = (taskIndex, tagString) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const updatedTasks = [...template.structure.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      tags
    };

    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        tasks: updatedTasks
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axiosInstance.put(`/templates/single/edit/${templateId}`, template);
      toast.success('Template updated successfully');
      navigate('/project-template');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update template');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-20 px-4 flex items-center justify-center">
        <div className="text-blue-300 text-xl">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-12 px-4">
      <div className="max-w-5xl mx-auto mt-14">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/project-template')}
            className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Templates
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-10">
          Edit Template
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                  Template Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={template.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={template.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Category & Visibility */}
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={template.category}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="visibility">
                  Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="Private"
                      checked={template.visibility === 'Private'}
                      onChange={handleChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="Public"
                      checked={template.visibility === 'Public'}
                      onChange={handleChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Public</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-300">Tasks</h2>
              <button 
                type="button"
                onClick={addTask}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Task
              </button>
            </div>

            {template.structure.tasks.length === 0 ? (
              <div className="text-center py-6 bg-gray-700/60 rounded-lg border border-gray-600">
                <p className="text-gray-400">No tasks added yet</p>
                <button 
                  type="button"
                  onClick={addTask}
                  className="mt-2 flex items-center mx-auto bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {template.structure.tasks.map((task, taskIndex) => (
                  <div 
                    key={taskIndex} 
                    className="bg-gray-700/60 rounded-lg border border-gray-600 p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-blue-300">Task {taskIndex + 1}</h3>
                      <button 
                        type="button"
                        onClick={() => removeTask(taskIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove Task"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={task.title || ''}
                          onChange={(e) => handleTaskChange(taskIndex, 'title', e.target.value)}
                          required
                          className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={task.estimatedHours || 0}
                          onChange={(e) => handleTaskChange(taskIndex, 'estimatedHours', parseFloat(e.target.value))}
                          className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={task.description || ''}
                        onChange={(e) => handleTaskChange(taskIndex, 'description', e.target.value)}
                        rows="2"
                        className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Priority
                        </label>
                        <select
                          value={task.priority || 'Medium'}
                          onChange={(e) => handleTaskChange(taskIndex, 'priority', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {priorities.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Status
                        </label>
                        <select
                          value={task.status || 'To Do'}
                          onChange={(e) => handleTaskChange(taskIndex, 'status', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Assignee Type
                        </label>
                        <select
                          value={task.assigneeType || 'Unassigned'}
                          onChange={(e) => handleTaskChange(taskIndex, 'assigneeType', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {assigneeTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(task.tags || []).join(', ')}
                        onChange={(e) => handleTagChange(taskIndex, e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="backend, frontend, testing"
                      />
                    </div>

                    {/* Subtasks */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-300">Subtasks</h4>
                        <button 
                          type="button"
                          onClick={() => addSubtask(taskIndex)}
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Subtask
                        </button>
                      </div>

                      {(!task.subtasks || task.subtasks.length === 0) ? (
                        <p className="text-sm text-gray-400 italic">No subtasks</p>
                      ) : (
                        <div className="space-y-3 pl-4 border-l-2 border-gray-600">
                          {task.subtasks.map((subtask, subtaskIndex) => (
                            <div key={subtaskIndex} className="bg-gray-600/70 rounded p-3 relative">
                              <button
                                type="button"
                                onClick={() => removeSubtask(taskIndex, subtaskIndex)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                                title="Remove Subtask"
                              >
                                <X size={14} />
                              </button>

                              <div className="mb-2">
                                <label className="block text-gray-300 text-xs font-medium mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={subtask.title || ''}
                                  onChange={(e) => handleSubtaskChange(taskIndex, subtaskIndex, 'title', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-500 rounded py-1.5 px-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-300 text-xs font-medium mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={subtask.description || ''}
                                  onChange={(e) => handleSubtaskChange(taskIndex, subtaskIndex, 'description', e.target.value)}
                                  rows="2"
                                  className="w-full bg-gray-700 border border-gray-500 rounded py-1.5 px-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-10 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/project-template')}
              className="py-2 px-4 border border-gray-500 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTemplatePage;