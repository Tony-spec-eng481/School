import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  TrendingUp,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useAuth } from '@elearning/shared';
import StatsOverview from "./StatsOverview";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SupportCenter from "./SupportCenter";
import SystemSettings from "./SystemSettings";
import ContentManagement from "./ContentManagement";
import TeacherManagement from "./TeacherManagement";
import StudentManagement from "./StudentManagement";
import Announcements from "./Announcements";
import "@elearning/shared/styles/AdminDashboard/AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "users", label: "User Management", icon: <Users size={20} /> },
    { id: "courses", label: "Course Management", icon: <BookOpen size={20} /> },
    { id: "content", label: "Content Approvals", icon: <Shield size={20} /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp size={20} /> },
    { id: "announcements", label: "Announcements", icon: <Bell size={20} /> },
    { id: "support", label: "Support & Help", icon: <HelpCircle size={20} /> },
    { id: "settings", label: "System Config", icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}
      >
        <div className="sidebar-header">
          {isSidebarOpen && (
            <div className="brand-logo">
              <div className="logo-icon">A</div>
              <span>ADMIN</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="toggle-sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <div className="active-indicator"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="logout-container">
          <button onClick={logout} className="logout-button">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-title">
            <h1>
              {activeTab === "overview"
                ? "Overview"
                : activeTab.replace("-", " ")}
            </h1>
            <p className="welcome-text">Welcome back, {user?.name}</p>
          </div>

          <div className="header-actions">
            <button className="notification-button">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="header-divider"></div>
            <div className="user-profile">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-id">{user?.user_id || "ADMIN"}</p>
              </div>
              <div className="user-avatar">{user?.name?.[0]}</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-grid">
            {activeTab === "overview" && (
              <>
                <StatsOverview />
                <UserManagement />
              </>
            )}

            {activeTab === "users" && (
              <div className="space-y-8">
                <UserManagement />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TeacherManagement />
                  <StudentManagement />
                </div>
              </div>
            )}

            {activeTab === "courses" && <CourseManagement />}

            {activeTab === "content" && <ContentManagement />}

            {activeTab === "analytics" && <AnalyticsDashboard />}

            {activeTab === "announcements" && <Announcements />}

            {activeTab === "support" && <SupportCenter />}

            {activeTab === "settings" && <SystemSettings />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
