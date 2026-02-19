import React, { useState, useEffect } from 'react';
import { studentApi } from '@elearning/shared';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiVideo,
  FiAward,
  FiBarChart2,
} from "react-icons/fi";

const StudentOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching student stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Enrolled Courses</span>
              <span className="stat-card-value">{stats?.enrolledCourses || 0}</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '0.5rem', color: '#3b82f6' }}>
              <FiBookOpen size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Completed Lessons</span>
              <span className="stat-card-value">{stats?.completedLessons || 0}</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#f0fdf4', borderRadius: '0.5rem', color: '#22c55e' }}>
              <FiCheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Learning Streak</span>
              <span className="stat-card-value">{stats?.streak || 0} days</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#fff7ed', borderRadius: '0.5rem', color: '#f97316' }}>
              <FiTrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Progress</span>
              <span className="stat-card-value">{stats?.avgProgress || 0}%</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '0.5rem', color: '#8b5cf6' }}>
              <FiBarChart2 size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Live Today</span>
              <span className="stat-card-value">{stats?.liveClassesToday || 0}</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#fff1f2', borderRadius: '0.5rem', color: '#e11d48' }}>
              <FiVideo size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span className="stat-card-label">Certificates</span>
              <span className="stat-card-value">{stats?.certificates || 0}</span>
            </div>
            <div style={{ padding: '0.5rem', background: '#fdf4ff', borderRadius: '0.5rem', color: '#a855f7' }}>
              <FiAward size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for charts or recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--student-border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Learning Progress</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Chart visualization would go here
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--student-border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Upcoming Deadline</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid #fee2e2', borderRadius: '0.5rem', background: '#fef2f2' }}>
            <div style={{ padding: '0.5rem', background: '#ef4444', color: 'white', borderRadius: '0.25rem' }}>
               <FiClock />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Assignment 1</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: 2 days left</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
