import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../libs/axios';
import toast from 'react-hot-toast';
import {
  Users, UserCheck, UserX, Image, ImageOff, UserCog, ShieldAlert,
} from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6'];

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

const UserReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get('/reports/user-reports');
        setReport(res.data.data);
      } catch (err) {
        toast.error('Failed to load user report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading user reports...</p>
      </div>
    );
  }

  if (!report) return null;

  const {
    totalUsers,
    usersByRole,
    profileImageStats,
    teamStats,
    projectStats,
    orphanedUsers,
    signUpsOverTime,
  } = report;

  const userRolePieData = usersByRole.map((r, i) => ({
    name: r._id,
    value: r.count,
    color: COLORS[i % COLORS.length],
  }));

  const signUpLineData = signUpsOverTime.map((item) => ({
    name: item.month,
    Signups: item.count,
  }));

  const imageBarData = [
    { name: 'With Image', value: profileImageStats.withProfileImage },
    { name: 'Without Image', value: profileImageStats.withoutProfileImage },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12">
          User Analytics
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard icon={Users} label="Total Users" value={totalUsers} color="from-purple-600 to-blue-500" />
          {usersByRole.map((role) => (
            <StatCard
              key={role._id}
              icon={UserCog}
              label={`Role: ${role._id}`}
              value={role.count}
              color="from-cyan-600 to-blue-500"
            />
          ))}
          <StatCard
            icon={Image}
            label="With Profile Image"
            value={profileImageStats.withProfileImage}
            color="from-green-500 to-teal-500"
          />
          <StatCard
            icon={ImageOff}
            label="Without Profile Image"
            value={profileImageStats.withoutProfileImage}
            color="from-red-500 to-pink-500"
          />
          <StatCard
            icon={UserCheck}
            label="Users in Teams"
            value={teamStats.inTeams}
            color="from-emerald-600 to-green-500"
          />
          <StatCard
            icon={UserX}
            label="Not in Teams"
            value={teamStats.notInTeams}
            color="from-rose-600 to-red-500"
          />
          <StatCard
            icon={UserCheck}
            label="Users in Projects"
            value={projectStats.inProjects}
            color="from-sky-500 to-cyan-500"
          />
          <StatCard
            icon={UserX}
            label="Not in Projects"
            value={projectStats.notInProjects}
            color="from-fuchsia-600 to-pink-500"
          />
          <StatCard
            icon={ShieldAlert}
            label="Orphaned Users"
            value={orphanedUsers}
            color="from-yellow-600 to-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Line Chart - Signups */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">Signups Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={signUpLineData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Signups" stroke="#60a5fa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart - User Roles */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl text-white font-semibold mb-4">User Roles</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRolePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label
                >
                  {userRolePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Profile Images */}
        <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-6 mt-10">
          <h3 className="text-xl text-white font-semibold mb-4">Profile Image Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={imageBarData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserReportPage;
