import { useEffect, useState } from "react";
import {
  BookOpen, Users, FileText, ClipboardList, Radio, Mail,
  Plus, TrendingUp, Activity, Star,
} from "lucide-react";
import { useAuth } from '@elearning/shared';
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherOverview.css";

interface TeacherStats {
  totalUnits: number;
  totalPrograms: number;
  upcomingClasses: any[];
  recentSubmissions: any[];
}

const defaultStats: TeacherStats = {
  totalUnits: 0,
  totalPrograms: 0,
  upcomingClasses: [],
  recentSubmissions: [],
};

const ACTIVITY_FEED = [
  { dot: "green",  title: "New student enrolled in Crop Science 101", time: "2 min ago" },
  { dot: "blue",   title: "Assignment submitted: Soil Analysis Quiz", time: "15 min ago" },
  { dot: "orange", title: "Live class scheduled for tomorrow 10:00 AM", time: "1 hr ago" },
  { dot: "red",    title: "Content pending admin approval: Topic 4", time: "3 hrs ago" },
  { dot: "green",  title: "5 students completed Irrigation Module", time: "Yesterday" },
];

const QUICK_ACTIONS = [
  { icon: <FileText size={18} />, label: "Add Topic", sub: "Expand existing unit content" },
  { icon: <Radio size={18} />, label: "Schedule Live Class", sub: "Set up a live session" },
  { icon: <ClipboardList size={18} />, label: "Create Assignment", sub: "Quiz or written task" },
];

const TeacherOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/lecturer/overview");
        setStats(res.data);
      } catch {
        // Use defaults silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: <BookOpen size={22} />, cls: "to-icon-green",  label: "Total Units",       val: stats.totalUnits },
    { icon: <Users size={22} />,    cls: "to-icon-blue",   label: "Total Programs",    val: stats.totalPrograms },
    { icon: <Radio size={22} />,    cls: "to-icon-teal",   label: "Live Classes",      val: stats.upcomingClasses.length },
    { icon: <ClipboardList size={22} />, cls: "to-icon-orange", label: "Recent Submissions", val: stats.recentSubmissions.length },
  ];

  return (
    <div>
      {/* Profile Card */}
      <div className="to-profile-card">
        <div className="to-profile-avatar">
          {user?.name?.[0]?.toUpperCase() ?? "T"}
        </div>
        <div className="to-profile-info">
          <h2>{user?.name ?? "Teacher"}</h2>
          <div className="to-profile-meta">
            <span className="to-meta-item">
              <Mail size={14} /> {user?.email}
            </span>
            <span className="to-meta-item">
              <Activity size={14} /> {user?.user_id ?? "TCH-001"}
            </span>
          </div>
        </div>
        <div className="to-profile-badges">
          <span className="to-profile-badge">✅ Verified Teacher</span>
          <span className="to-profile-badge">🌱 Agriculture Expert</span>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="td-loading"><div className="td-spinner" /></div>
      ) : (
        <div className="to-stats-grid">
          {statCards.map((s, i) => (
            <div key={i} className="to-stat-card">
              <div className={`to-stat-icon ${s.cls}`}>{s.icon}</div>
              <div className="to-stat-body">
                <p>{s.label}</p>
                <div className="to-stat-val">{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Grid */}
      <div className="to-bottom-grid" style={{ marginTop: "1.5rem" }}>
        {/* Quick Actions */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">⚡ Quick Actions</span>
          </div>
          <div className="td-card-body">
            <div className="to-quick-actions">
              {QUICK_ACTIONS.map((a, i) => (
                <button key={i} className="to-action-btn">
                  <div className="to-action-icon">{a.icon}</div>
                  <div className="to-action-text">
                    <strong>{a.label}</strong>
                    <span>{a.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📋 Recent Activity</span>
            <span className="td-badge td-badge-green">
              <TrendingUp size={10} /> Live
            </span>
          </div>
          <div className="td-card-body" style={{ padding: "0" }}>
            <div className="to-activity-list" style={{ padding: "0 1.5rem" }}>
              {ACTIVITY_FEED.map((a, i) => (
                <div key={i} className="to-activity-item">
                  <div className={`to-activity-dot ${a.dot}`} />
                  <div className="to-activity-body">
                    <strong>{a.title}</strong>
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
