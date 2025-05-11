import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddMemberModal from '../components/AddMemberModal';
import AddTeamModal from '../components/AddTeamModal';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data');
        console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/auth/me`);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        
        console.log('User data response:', response.data);
        
        // Make sure we're getting the correct user ID
        const id = response.data.user?._id || response.data._id;
        console.log('Setting user ID to:', id);
        setUserId(id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.error('Error details:', error.response?.data);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
    // Only fetch project data after we have the user ID
    if (userId) {
      fetchProjectData();
    }
  }, [projectId, userId]);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      console.log(`Fetching project data for ID: ${projectId}`);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/projects/${projectId}`);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
        withCredentials: true,
      });
      
      console.log('Project data response:', response.data);
      setProject(response.data.project);
      
      // Check if current user is the owner
      const ownerMember = response.data.project.members.find(
        member => member.role === 'Owner'
      );
      
      console.log('Owner member:', ownerMember);
      console.log('Current user ID:', userId);
      
      if (ownerMember && userId) {
        const isCurrentUserOwner = ownerMember.user._id === userId;
        console.log('Is current user the owner?', isCurrentUserOwner);
        setIsOwner(isCurrentUserOwner);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load project details');
      navigate('/projects');
      setIsLoading(false);
    }
  };

  const handleAddMember = async (userData) => {
    try {
      console.log('Adding member with data:', userData);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/projects/${projectId}/members`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/members`,
        userData,
        { withCredentials: true }
      );
      
      console.log('Add member response:', response.data);
      toast.success('Member added successfully');
      fetchProjectData();
      setIsAddMemberModalOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        console.log(`Removing member with ID: ${memberId}`);
        console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/projects/${projectId}/members/${memberId}`);
        
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/members/${memberId}`,
          { withCredentials: true }
        );
        
        console.log('Remove member response:', response.data);
        toast.success('Member removed successfully');
        fetchProjectData();
      } catch (error) {
        console.error('Error removing member:', error);
        console.error('Error details:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleAddTeam = async (teamData) => {
    try {
      console.log('Adding team with data:', teamData);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/projects/${projectId}/teams`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/teams`,
        teamData,
        { withCredentials: true }
      );
      
      console.log('Add team response:', response.data);
      toast.success('Team added successfully');
      fetchProjectData();
      setIsAddTeamModalOpen(false);
    } catch (error) {
      console.error('Error adding team:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add team');
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to remove this team?')) {
      try {
        console.log(`Removing team with ID: ${teamId}`);
        console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/projects/${projectId}/teams/${teamId}`);
        
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/teams/${teamId}`,
          { withCredentials: true }
        );
        
        console.log('Remove team response:', response.data);
        toast.success('Team removed successfully');
        fetchProjectData();
      } catch (error) {
        console.error('Error removing team:', error);
        console.error('Error details:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to remove team');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-300 mb-4">{project.description || 'No description'}</p>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-full hover:bg-gray-700/50">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-gray-700/50">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('members')}
            >
              <Users size={18} />
              Members
            </button>
            <button
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('teams')}
            >
              <Briefcase size={18} />
              Teams
            </button>
          </div>

          {activeTab === 'members' ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Project Members</h2>
                {isOwner && (
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 shadow-lg"
                  >
                    <Plus size={16} />
                    Add Member
                  </button>
                )}
              </div>

              <div className="bg-gray-800/60 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      {isOwner && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {project.members.map((member) => (
                      <tr key={member.user._id} className="border-b border-gray-700/50 last:border-0">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white font-medium mr-3">
                              {member.user.profileImage ? (
                                <img
                                  src={member.user.profileImage}
                                  alt={member.user.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                member.user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-200">
                              {member.user.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            member.role === 'Owner'
                              ? 'bg-purple-900/50 text-purple-300'
                              : member.role === 'Manager'
                              ? 'bg-blue-900/50 text-blue-300'
                              : 'bg-gray-700/50 text-gray-300'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        {isOwner && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {member.role !== 'Owner' && (
                              <button
                                onClick={() => handleRemoveMember(member.user._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Project Teams</h2>
                {isOwner && (
                  <button
                    onClick={() => setIsAddTeamModalOpen(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 shadow-lg"
                  >
                    <Plus size={16} />
                    Add Team
                  </button>
                )}
              </div>

              {project.teams && project.teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.teams.map((team) => (
                    <div
                      key={team._id}
                      className="bg-gray-800/60 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 p-4"
                    >
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">{team.name}</h3>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveTeam(team._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{team.description || 'No description'}</p>
                      
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {team.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800/60 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 p-8 text-center">
                  <Briefcase size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-300 mb-4">No teams added to this project yet</p>
                  {isOwner && (
                    <button
                      onClick={() => setIsAddTeamModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Team
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddMemberModalOpen && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onAddMember={handleAddMember}
        />
      )}

      {isAddTeamModalOpen && (
        <AddTeamModal
          isOpen={isAddTeamModalOpen}
          onClose={() => setIsAddTeamModalOpen(false)}
          onAddTeam={handleAddTeam}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage; 