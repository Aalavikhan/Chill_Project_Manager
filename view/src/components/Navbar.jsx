import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Bell, User, LockKeyhole,
  LayoutDashboard, ClipboardList,
  Users, CalendarDays, BarChart2, UserPlus, FileStack, BarChart
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Planzo core links
  const links = [
    
    { path: '/', name: 'Team', icon: <Users size={20} /> },
    { path: '/create-team', name: 'Create Team', icon: <UserPlus size={20} /> },
    { path: '/projects', name: 'Projects', icon: <ClipboardList size={20} /> },
    { path: '/project-template', name: 'Templates', icon: <FileStack size={20} /> },
    { path: '/tasks', name: 'Tasks', icon: <ClipboardList size={20} /> },

    
    
  ];

  const adminLinks = [
    { path: '/', name: 'User Reports', icon: <BarChart2 size={20} /> },
    { path: '/team-reports', name: 'Team Reports', icon: <BarChart size={20} /> },
  ]

  return (
    <nav className="bg-[#1E1E2E] shadow-md fixed w-full z-10 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400">Planzo</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            {authUser ? (
              <>
                { authUser.role.toLowerCase() === "admin" ? (
                    <div className="hidden md:flex items-center gap-4">
                    {adminLinks.map(adminLinks => (
                      <Link
                        key={adminLinks.path}
                        to={adminLinks.path}
                        className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        {adminLinks.icon}
                        <span>{adminLinks.name}</span>
                      </Link>
                    ))}
  
                    {/* Notification */}
                    <button
                      onClick={() => toast('No new notifications')}
                      className="relative text-gray-300 hover:text-cyan-400"
                    >
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        0
                      </span>
                    </button>
                  </div>
                ):(
                  <div className="hidden md:flex items-center gap-4">
                  {links.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}

                  {/* Notification */}
                  <button
                    onClick={() => toast('No new notifications')}
                    className="relative text-gray-300 hover:text-cyan-400"
                  >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>
                )}



                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-cyan-400"
                  >
                    <User size={20} />
                    <span>{authUser.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#2A2A3A] rounded-md shadow-lg py-2 border border-gray-600">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        <LockKeyhole size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not logged in
              <div className="flex items-center gap-4">
                <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400">
                  <LockKeyhole size={20} />
                  Login
                </Link>
                <Link to="/signup" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400">
                  <User size={20} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
