import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../libs/axios';
import toast from 'react-hot-toast';
import {
  Users, FolderKanban, UserCog, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#a78bfa', '#f43f5e', '#facc15'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300">
    <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-blue-200">{value}</p>
    </div>
  </div>
);

const TeamReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get('/reports/team-reports');
        setReport(res.data.data);
      } catch (err) {
        toast.error('Failed to load team report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading team reports...</p>
      </div>
    );
  }

  if (!report) return null;

  const {
    teamsOverview,
    memberRoleCounts,
    averageProjectsPerTeam,
    inactiveTeams,
    topTeamsByMembers,
    topTeamsByProjects,
  } = report;

  const teamCreationData = teamsOverview.map(team => ({
    name: team.name,
    month: new Date(team.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' }),
  }));

  const monthGrouped = teamCreationData.reduce((acc, { month }) => {
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const lineData = Object.entries(monthGrouped).map(([month, count]) => ({
    month,
    count,
  }));

  const pieData = memberRoleCounts.map((r, idx) => ({
    name: r._id,
    value: r.count,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12">
          Team Analytics
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard icon={FolderKanban} label="Avg Projects / Team" value={averageProjectsPerTeam.toFixed(2)} color="from-teal-500 to-green-500" />
          <StatCard icon={Users} label="Total Teams" value={teamsOverview.length} color="from-purple-500 to-indigo-500" />
          <StatCard icon={AlertCircle} label="Inactive Teams" value={inactiveTeams.noProjects.length} color="from-rose-500 to-pink-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bar: Top by Members */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">Top Teams by Members</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTeamsByMembers}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="memberCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar: Top by Projects */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">Top Teams by Projects</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTeamsByProjects}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="projectCount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          {/* Pie: Role Distribution */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">Role Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line: Team Creation */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">Teams Created Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inactive Teams List */}
        <div className="mt-12 bg-gray-800/70 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl text-white font-semibold mb-4">Teams with No Projects</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            {inactiveTeams.noProjects.map(team => (
              <li key={team._id} className="flex justify-between border-b border-gray-700 py-2">
                <span>{team.name}</span>
                <span>{new Date(team.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamReportPage;
