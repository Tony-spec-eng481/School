// StudentDashboard.tsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  FiLogOut,
  FiMenu,
  FiX,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "@elearning/shared";
import "../styles/Dashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking outside or navigating
  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="student-dashboard-container">
      {/* Mobile Menu Toggle - Always visible on mobile */}
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      )}

      {/* Sidebar Navigation */}
      <aside className={`student-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="logo">TRESPICS SCHOOL</span>
          {isMobile && (
            <button
              className="sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiHome size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/dashboard/units"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiBookOpen size={18} />
            <span>My Units</span>
          </NavLink>
          <NavLink
            to="/dashboard/courses"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiBarChart2 size={18} />
            <span>Courses</span>
          </NavLink>
          <NavLink
            to="/dashboard/live-classes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiVideo size={18} />
            <span>Live Classes</span>
          </NavLink>
          <NavLink
            to="/dashboard/assignments"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiFileText size={18} />
            <span>Assignments</span>
          </NavLink>
          <NavLink
            to="/dashboard/announcements"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiBell size={18} />
            <span>Announcements</span>
          </NavLink>
          <NavLink
            to="/dashboard/clubs"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiUsers size={18} />{" "}
            {/* Or FiGrid, FiHeart, etc. - choose a clubs-appropriate icon */}
            <span>Clubs</span>
          </NavLink>
          <NavLink
            to="/dashboard/support"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiMessageSquare size={18} />
            <span>Support</span>
          </NavLink>
          <NavLink
            to="/dashboard/certificates"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiAward size={18} />
            <span>Certificates</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <FiSettings size={18} />
            <span>Settings</span>
          </NavLink>
          <button onClick={logout} className="nav-item logout-btn">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="student-main-content">
        <header className="dashboard-header">
          <h1>Welcome back, {user?.name || "Student"}!</h1>
          <div className="user-profile-badge">
            <span className="user-name">{user?.name || "Student"}</span>
            <div className="avatar">{user?.name?.charAt(0) || "S"}</div>
          </div>
        </header>

        {/* Content loaded via nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;
