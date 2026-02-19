import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen, Video, Users } from 'lucide-react';
// import logo from '../../assets/logo.jpeg'; 

const SidebarItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <Link to={to} className="flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white transition-colors">
    {icon}
    <span>{label}</span>
  </Link>
);

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 flex items-center justify-center border-b border-blue-800">
          <h1 className="text-2xl font-bold">Trespics</h1>
        </div>
        
        <nav className="flex-1 mt-6">
          <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/courses" icon={<BookOpen size={20} />} label="Courses" />
          
          {role === 'teacher' || role === 'admin' ? (
             <SidebarItem to="/live-classes" icon={<Video size={20} />} label="Live Classes" />
          ) : null}

          {role === 'student' && (
             <SidebarItem to="/my-learning" icon={<Video size={20} />} label="My Learning" />
          )}
          
           {role === 'admin' && (
             <SidebarItem to="/users" icon={<Users size={20} />} label="Users" />
          )}

        </nav>

        <div className="p-4 border-t border-blue-800">
            <div className="flex items-center space-x-3 px-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    {user?.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
            </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
