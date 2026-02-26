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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching student stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
              <span className="stat-card-label">Learning Streak</span>
              <span className="stat-card-value">{stats?.streak || 0} days</span>
            </div>
            <div className="stat-card-icon icon-orange">
              <FiTrendingUp size={20} />
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
          <div className="deadline-item">
            <div className="deadline-icon">
              <FiClock size={20} />
            </div>
            <div className="deadline-content">
              <p className="deadline-title">Assignment 1</p>
              <div className="deadline-meta">
                <span>Due: 2 days left</span>
                <span className="deadline-badge">Urgent</span>
              </div>
            </div>
          </div>

          <div
            className="deadline-item"
            style={{
              borderColor: "var(--orange-100)",
              background: "var(--orange-50)",
            }}
          >
            <div
              className="deadline-icon"
              style={{ background: "var(--orange-500)" }}
            >
              <FiClock size={20} />
            </div>
            <div className="deadline-content">
              <p className="deadline-title">Quiz: Chapter 5</p>
              <div className="deadline-meta">
                <span>Due: 5 days left</span>
              </div>
            </div>
          </div>

          <div
            className="deadline-item"
            style={{
              borderColor: "var(--green-100)",
              background: "var(--green-50)",
            }}
          >
            <div
              className="deadline-icon"
              style={{ background: "var(--green-500)" }}
            >
              <FiClock size={20} />
            </div>
            <div className="deadline-content">
              <p className="deadline-title">Project Submission</p>
              <div className="deadline-meta">
                <span>Due: 7 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
