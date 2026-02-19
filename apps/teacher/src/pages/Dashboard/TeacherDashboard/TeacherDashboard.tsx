import { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, Video, Users, User, ClipboardList,
  Radio, Bell, BarChart2, Calendar, LogOut, Menu, X, GraduationCap,
} from "lucide-react";
import { useAuth } from '@elearning/shared';
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherContentManagement from "./TeacherContentManagement";
import TeacherStudents from "./TeacherStudents";
import TeacherAssignments from "./TeacherAssignments";
import TeacherLiveClasses from "./TeacherLiveClasses";
import TeacherAnnouncements from "./TeacherAnnouncements";
import TeacherAnalytics from "./TeacherAnalytics";
import TeacherCalendar from "./TeacherCalendar";
import TeacherProfile from "./TeacherProfile";
import "@elearning/shared/styles/TeacherDashboard/TeacherDashboard.css";

const menuItems = [
  { id: "overview",  label: "Dashboard",          icon: <LayoutDashboard size={20} />, section: "MAIN" },
  { id: "courses",   label: "My Courses",          icon: <BookOpen size={20} />,        section: "MAIN" },
  { id: "content",   label: "Content Management",  icon: <Video size={20} />,           section: "MAIN" },
  { id: "students",  label: "Student Management",  icon: <Users size={20} />,           section: "MAIN" },
  { id: "assignments", label: "Assignments",       icon: <ClipboardList size={20} />,   section: "TEACH" },
  { id: "live",      label: "Live Classes",         icon: <Radio size={20} />,           section: "TEACH" },
  { id: "announcements", label: "Announcements",   icon: <Bell size={20} />,            section: "TEACH", badge: true },
  { id: "analytics", label: "Analytics",           icon: <BarChart2 size={20} />,       section: "INSIGHTS" },
  { id: "calendar",  label: "Calendar",            icon: <Calendar size={20} />,        section: "INSIGHTS" },
  { id: "profile",   label: "My Profile",          icon: <User size={20} />,            section: "INSIGHTS" },
];

const SECTION_LABELS: Record<string, string> = {
  MAIN: "Management",
  TEACH: "Teaching",
  INSIGHTS: "Insights",
};

const TabTitle: Record<string, string> = {
  overview: "Dashboard Overview",
  courses: "My Courses",
  content: "Content Management",
  students: "Student Management",
  assignments: "Assignments & Assessments",
  live: "Live Classes",
  announcements: "Announcements",
  analytics: "Analytics",
  calendar: "Calendar",
  profile: "My Profile",
};

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    // Mobile: collapse sidebar by default
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const sections = [...new Set(menuItems.map((m) => m.section))];

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <aside className={`teacher-sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        {/* Brand */}
        <div className="teacher-sidebar-header">
          {isSidebarOpen && (
            <div className="teacher-brand">
              <div className="teacher-brand-icon">
                <GraduationCap size={16} />
              </div>
              <span>TEACHER</span>
            </div>
          )}
          <button
            className="teacher-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse" : "Expand"}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="teacher-sidebar-nav">
          {sections.map((section) => (
            <div key={section}>
              {isSidebarOpen && (
                <p className="teacher-nav-section-label">{SECTION_LABELS[section]}</p>
              )}
              {menuItems
                .filter((m) => m.section === section)
                .map((item) => (
                  <button
                    key={item.id}
                    className={`teacher-nav-item ${activeTab === item.id ? "active" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="teacher-nav-icon">{item.icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className="teacher-nav-label">{item.label}</span>
                        {item.badge && notifCount > 0 && (
                          <span className="teacher-nav-badge">{notifCount}</span>
                        )}
                        {activeTab === item.id && <div className="teacher-active-dot" />}
                      </>
                    )}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="teacher-logout-wrap">
          <button className="teacher-logout-btn" onClick={logout}>
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="teacher-main">
        {/* Header */}
        <header className="teacher-header">
          <div className="teacher-header-left">
            <h1>{TabTitle[activeTab]}</h1>
            <p className="teacher-header-subtitle">
              Welcome back, <strong>{user?.name}</strong>
            </p>
          </div>

          <div className="teacher-header-right">
            <button
              className="teacher-notif-btn"
              onClick={() => setActiveTab("announcements")}
              title="Notifications"
            >
              <Bell size={20} />
              {notifCount > 0 && <span className="teacher-notif-dot" />}
            </button>
            <div className="teacher-divider" />
            <div className="teacher-profile-chip">
              <div className="teacher-profile-info">
                <p className="teacher-profile-name">{user?.name}</p>
                <p className="teacher-profile-role">Teacher</p>
              </div>
              <div className="teacher-avatar">{user?.name?.[0]?.toUpperCase() ?? "T"}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="teacher-content-area" key={activeTab}>
          {activeTab === "overview"      && <TeacherOverview />}
          {activeTab === "courses"       && <TeacherCourses />}
          {activeTab === "content"       && <TeacherContentManagement />}
          {activeTab === "students"      && <TeacherStudents />}
          {activeTab === "assignments"   && <TeacherAssignments />}
          {activeTab === "live"          && <TeacherLiveClasses />}
          {activeTab === "announcements" && <TeacherAnnouncements onNotifCount={setNotifCount} />}
          {activeTab === "analytics"     && <TeacherAnalytics />}
          {activeTab === "calendar"      && <TeacherCalendar />}
          {activeTab === "profile"       && <TeacherProfile />}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
