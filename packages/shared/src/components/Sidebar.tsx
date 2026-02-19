import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  links: { to: string; label: string; icon?: React.ReactNode }[];
  title: string;
}

const Sidebar = ({ links, title }: SidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">Hello, {user?.name}</p>
      </div>
      
      <nav className="flex-1 py-4">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active bg-blue-900 text-white' : ''}`}
            end
          >
            <span className="mr-3">{link.icon || '•'}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={logout} 
          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded transition"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
