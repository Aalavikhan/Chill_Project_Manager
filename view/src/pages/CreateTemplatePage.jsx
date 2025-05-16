import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../libs/axios';
import { useAuthStore } from '../stores/authStore';
import { Plus, Trash } from 'lucide-react';

const categories = ['Development', 'Marketing', 'Design', 'HR', 'General', 'Other'];
const visibilities = ['Private', 'Public'];
const priorities = ['Low', 'Medium', 'High'];
const statuses = ['To Do', 'In Progress', 'Review', 'Complete'];
const assigneeTypes = ['Project Manager', 'Developer', 'Designer', 'Tester', 'Unassigned'];

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'General',
    visibility: 'Private',
    team: '',
    structure: {
      tasks: []
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    setForm({
      ...form,
      structure: {
        tasks: [...form.structure.tasks, {
          title: '',
          description: '',
          priority: 'Medium',
          status: 'To Do',
          estimatedHours: 0,
          tags: [],
          assigneeType: 'Unassigned',
          subtasks: []
        }]
      }
    });
  };

  const updateTask = (index, field, value) => {
    const updatedTasks = [...form.structure.tasks];
    updatedTasks[index][field] = value;
    setForm({ ...form, structure: { tasks: updatedTasks } });
  };

  const addSubtask = (taskIndex) => {
    const updatedTasks = [...form.structure.tasks];
    updatedTasks[taskIndex].subtasks.push({ title: '', description: '' });
    setForm({ ...form, structure: { tasks: updatedTasks } });
  };

  const updateSubtask = (taskIndex, subIndex, field, value) => {
    const updatedTasks = [...form.structure.tasks];
    updatedTasks[taskIndex].subtasks[subIndex][field] = value;
    setForm({ ...form, structure: { tasks: updatedTasks } });
  };

  const removeTask = (index) => {
    const updatedTasks = [...form.structure.tasks];
    updatedTasks.splice(index, 1);
    setForm({ ...form, structure: { tasks: updatedTasks } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        team: form.team ? [form.team] : []
      };
      await axiosInstance.post('/templates/create', payload);
      toast.success('Template created!');
      navigate('/project-template');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create template');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-20 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800/80 rounded-xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 text-center">
          Create New Template
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Template Name"
              className="bg-gray-900 text-white rounded-lg p-3 border border-gray-700 w-full" required />
            <select name="team" value={form.team} onChange={handleChange} className="bg-gray-900 text-white rounded-lg p-3 border border-gray-700">
              <option value="">Assign to Team (optional)</option>
              {authUser?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description"
            className="bg-gray-900 text-white rounded-lg p-3 border border-gray-700 w-full" rows="3" />

          <div className="grid grid-cols-2 gap-6">
            <select name="category" value={form.category} onChange={handleChange}
              className="bg-gray-900 text-white rounded-lg p-3 border border-gray-700">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select name="visibility" value={form.visibility} onChange={handleChange}
              className="bg-gray-900 text-white rounded-lg p-3 border border-gray-700">
              {visibilities.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <h3 className="text-xl text-blue-300 font-semibold mb-2">Tasks</h3>
            {form.structure.tasks.map((task, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <input value={task.title} onChange={e => updateTask(i, 'title', e.target.value)} placeholder="Task Title"
                    className="bg-gray-800 text-white rounded p-2 w-full mr-2" />
                  <button type="button" onClick={() => removeTask(i)} className="text-red-400 hover:text-red-500"><Trash size={18} /></button>
                </div>
                <textarea value={task.description} onChange={e => updateTask(i, 'description', e.target.value)}
                  placeholder="Task Description" rows={2}
                  className="w-full bg-gray-800 text-white rounded p-2" />
                <div className="grid grid-cols-3 gap-4">
                  <select value={task.priority} onChange={e => updateTask(i, 'priority', e.target.value)} className="bg-gray-800 text-white p-2 rounded">
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <select value={task.status} onChange={e => updateTask(i, 'status', e.target.value)} className="bg-gray-800 text-white p-2 rounded">
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <select value={task.assigneeType} onChange={e => updateTask(i, 'assigneeType', e.target.value)} className="bg-gray-800 text-white p-2 rounded">
                    {assigneeTypes.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <input type="number" min={0} value={task.estimatedHours} onChange={e => updateTask(i, 'estimatedHours', e.target.value)}
                  className="w-full mt-2 bg-gray-800 text-white p-2 rounded" placeholder="Estimated Hours" />
                <div>
                  <h4 className="text-sm text-gray-300">Subtasks</h4>
                  {task.subtasks.map((sub, j) => (
                    <div key={j} className="grid grid-cols-2 gap-2 mt-2">
                      <input value={sub.title} onChange={e => updateSubtask(i, j, 'title', e.target.value)} className="bg-gray-800 text-white p-2 rounded" placeholder="Title" />
                      <input value={sub.description} onChange={e => updateSubtask(i, j, 'description', e.target.value)} className="bg-gray-800 text-white p-2 rounded" placeholder="Description" />
                    </div>
                  ))}
                  <button type="button" onClick={() => addSubtask(i)} className="text-sm mt-2 text-blue-400 hover:underline">+ Add Subtask</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addTask} className="text-blue-400 hover:underline flex items-center gap-2">
              <Plus size={18} /> Add Task
            </button>
          </div>

          <div className="text-center pt-4">
            <button type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplate;
