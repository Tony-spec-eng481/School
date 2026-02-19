import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBookOpen, 
  FiVideo, 
  FiFileText, 
  FiBarChart2, 
  FiBell, 
  FiMessageSquare, 
  FiAward, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import '@elearning/shared/styles/studentdashboard/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  return (
    <div className="student-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="student-sidebar">
        <div className="sidebar-header">
          TRESPICS SCHOOL
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiHome size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard/courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiBookOpen size={18} />
            <span>My Courses</span>
          </NavLink>
          <NavLink to="/dashboard/live-classes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiVideo size={18} />
            <span>Live Classes</span>
          </NavLink>
          <NavLink to="/dashboard/assignments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiFileText size={18} />
            <span>Assignments</span>
          </NavLink>
          <NavLink to="/dashboard/progress" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiBarChart2 size={18} />
            <span>Progress</span>
          </NavLink>
          <NavLink to="/dashboard/announcements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiBell size={18} />
            <span>Announcements</span>
          </NavLink>
          <NavLink to="/dashboard/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiMessageSquare size={18} />
            <span>Support</span>
          </NavLink>
          <NavLink to="/dashboard/certificates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiAward size={18} />
            <span>Certificates</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiSettings size={18} />
            <span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="student-main-content">
        <header className="dashboard-header">
          <h1>Welcome back, {userName}!</h1>
          <div className="user-profile-badge">
            <span style={{ fontWeight: 500 }}>{userName}</span>
            <div className="avatar">{userName.charAt(0)}</div>
          </div>
        </header>

        {/* Content loaded via nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;
