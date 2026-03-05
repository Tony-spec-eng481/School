// StudentOverview.tsx
import React, { useState, useEffect } from "react";
import { studentApi } from "@elearning/shared";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiVideo,
  FiAward,
  FiBarChart2,
} from "react-icons/fi";
import "../styles/StudentOverview.css"; // Import the CSS file
import { useAuth } from "@elearning/shared";

const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, assignmentsRes] = await Promise.all([
          studentApi.getStats(),
          studentApi.getAssignments()
        ]);
        setStats(statsRes.data);
        
        // Filter for upcoming deadlines (due date in future and not submitted)
        const upcoming = assignmentsRes.data
          .filter((a: any) => !a.submission && a.due_date && new Date(a.due_date) > new Date())
          .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
          .slice(0, 3);
        setDeadlines(upcoming);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-overview animate-fade-in">
      <div className="welcome-header">
        <h1 className="welcome-title">
          Welcome back, {user?.name || "Student"}!
        </h1>
        <p className="welcome-subtitle">
          Track your progress and continue learning
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Enrolled Units</span>
              <span className="stat-card-value">
                {stats?.enrolledUnits || 0}
              </span>
            </div>
            <div className="stat-card-icon icon-blue">
              <FiBookOpen size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Completed Lessons</span>
              <span className="stat-card-value">
                {stats?.completedLessons || 0}
              </span>
            </div>
            <div className="stat-card-icon icon-green">
              <FiCheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Assignments</span>
              <span className="stat-card-value">{stats?.pendingAssignments || 0} Pending</span>
            </div>
            <div className="stat-card-icon icon-orange">
              <FiClock size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Progress</span>
              <span className="stat-card-value">
                {stats?.avgProgress || 0}%
              </span>
            </div>
            <div className="stat-card-icon icon-purple">
              <FiBarChart2 size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Live Today</span>
              <span className="stat-card-value">
                {stats?.liveClassesToday || 0}
              </span>
            </div>
            <div className="stat-card-icon icon-pink">
              <FiVideo size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-content">
              <span className="stat-card-label">Certificates</span>
              <span className="stat-card-value">
                {stats?.certificates || 0}
              </span>
            </div>
            <div className="stat-card-icon icon-violet">
              <FiAward size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Learning Progress</h3>
          <div className="chart-placeholder">
            Chart visualization would go here
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Upcoming Deadlines</h3>
          {deadlines.length > 0 ? (
            deadlines.map((d) => {
              const diffTime = new Date(d.due_date).getTime() - new Date().getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 2;

              return (
                <div 
                  key={d.id} 
                  className="deadline-item"
                  style={isUrgent ? { borderColor: "var(--red-100)", background: "var(--red-50)" } : {}}
                >
                  <div className="deadline-icon" style={isUrgent ? { background: "var(--red-500)" } : {}}>
                    <FiClock size={20} />
                  </div>
                  <div className="deadline-content">
                    <p className="deadline-title">{d.title}</p>
                    <div className="deadline-meta">
                      <span>Due: {diffDays} {diffDays === 1 ? 'day' : 'days'} left</span>
                      {isUrgent && <span className="deadline-badge">Urgent</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state-mini">
              <p>No upcoming deadlines!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
