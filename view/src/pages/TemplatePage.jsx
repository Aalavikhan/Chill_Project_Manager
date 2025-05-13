import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../libs/axios';
import { Pencil, Trash2, Search, ChevronDown, ChevronRight } from 'lucide-react';

const TemplatePage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [myTemplates, setMyTemplates] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [body, setBody] = useState({ category: "" });

  const categories = ['Development', 'Marketing', 'Design', 'HR', 'General', 'Other'];

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/templates/all', {
        params: {
          search,
          myTemplates: myTemplates.toString(),
          category: body.category
        }
      });
      setTemplates(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [myTemplates]);

  useEffect(() => {
    fetchTemplates();
  }, [body.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBody(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (templateId) => {
    try {
      const res = await axiosInstance.delete(`/templates/single/delete/${templateId}`);
      fetchTemplates();
      toast.success(res.data.msg);
    } catch (error) {
      toast.error("Template could not be deleted");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates();
  };

  const handleUseTemplate = () => {
    toast.success("Navigating to Project Creation...");
  };

  const toggleTaskExpansion = (templateId, taskIndex) => {
    setExpandedTasks(prev => {
      const key = `${templateId}-${taskIndex}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const isTaskExpanded = (templateId, taskIndex) => {
    const key = `${templateId}-${taskIndex}`;
    return expandedTasks[key] || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-20 px-4">
      <div className="max-w-6xl mx-auto mt-5 relative">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12">
          Browse Templates
        </h2>

        <button
          onClick={() => navigate('/create-template')}
          className="absolute right-0 top-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          + Create Template
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between items-start mb-8">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-800/80 text-gray-200 border border-gray-700 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          <div className="sm:ml-4 mb-4 sm:mb-0">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={body.category}
              onChange={handleChange}
              className="w-48 bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="myTemplates"
              checked={myTemplates}
              onChange={() => setMyTemplates(!myTemplates)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="myTemplates" className="ml-2 text-sm font-medium text-gray-300">
              Created By Me
            </label>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-200 text-center">Loading templates...</p>
        ) : templates.length === 0 ? (
          <p className="text-gray-300 text-center">No templates available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-lg p-6 flex flex-col justify-between relative"
              >
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.description || 'No description provided.'}</p>

                  <div className="text-sm text-gray-400 mb-1">
                    Category: <span className="text-gray-200 font-medium">{template.category}</span>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    Visibility: <span className="text-gray-200 font-medium">{template.visibility}</span>
                  </div>

                  {template.structure?.tasks?.length > 0 ? (
                    <div className="mt-2">
                      <h4 className="text-blue-300 text-sm font-medium mb-2">Tasks:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {template.structure.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="bg-gray-700/60 rounded-lg p-2">
                            <div className="flex items-start cursor-pointer" onClick={() => toggleTaskExpansion(template._id, taskIndex)}>
                              {task.subtasks?.length > 0 ? (
                                isTaskExpanded(template._id, taskIndex) ? (
                                  <ChevronDown size={16} className="text-gray-400 mt-1 mr-1 flex-shrink-0" />
                                ) : (
                                  <ChevronRight size={16} className="text-gray-400 mt-1 mr-1 flex-shrink-0" />
                                )
                              ) : <span className="w-4 h-4 mr-1" />}
                              <div className="flex-grow">
                                <div className="text-sm font-medium text-gray-200">{task.title}</div>
                                {task.priority && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    task.priority === 'High' ? 'bg-red-900/50 text-red-300' :
                                    task.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                                    'bg-green-900/50 text-green-300'
                                  }`}>
                                    {task.priority}
                                  </span>
                                )}
                              </div>
                            </div>

                            {isTaskExpanded(template._id, taskIndex) && task.subtasks?.length > 0 && (
                              <div className="pl-6 mt-2 space-y-1">
                                {task.subtasks.map((subtask, subtaskIndex) => (
                                  <div key={subtaskIndex} className="bg-gray-800/80 p-2 rounded text-xs text-gray-300">
                                    {subtask.title}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No tasks defined</p>
                  )}
                </div>

                {(template.canEdit || template.canDelete) && (
                  <div className="flex gap-3 absolute top-4 right-4">
                    {template.canEdit && (
                      <button
                        onClick={() => navigate(`/edit-template/${template._id}`)}
                        className="text-blue-400 hover:text-blue-300 transition"
                        title="Edit Template"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {template.canDelete && (
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Delete Template"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleUseTemplate(template._id)}
                  className="mt-4 self-end bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-900 transition font-bold"
                >
                  Use this Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePage;
