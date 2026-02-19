import { useState, useEffect } from "react";
import { BookOpen, Users, Star, Target } from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import "@elearning/shared/styles/TeacherDashboard/TeacherAnalytics.css";

const ENGAGEMENT = [
  { label: "Crop Science 101", pct: 84, cls: "" },
  { label: "Soil Health", pct: 67, cls: "" },
  { label: "Irrigation Systems", pct: 52, cls: "amber" },
];

const COMPLETION = [
  { label: "Crop Science 101", pct: 74, cls: "" },
  { label: "Soil Health", pct: 58, cls: "" },
  { label: "Irrigation Systems", pct: 38, cls: "amber" },
];

const DROPOFF = [
  { lesson: "Lesson 1", title: "Introduction to Crop Biology", dropoff: 5, cls: "low" },
  { lesson: "Lesson 2", title: "Photosynthesis & Growth", dropoff: 22, cls: "medium" },
  { lesson: "Lesson 3", title: "Pest & Disease Management", dropoff: 40, cls: "high" },
  { lesson: "Lesson 4", title: "Irrigation Basics", dropoff: 18, cls: "medium" },
  { lesson: "Lesson 5", title: "Soil Nutrition", dropoff: 12, cls: "low" },
];

const QUIZ_PERF = [
  { quiz: "Quiz 1 — Crop Basics", avg: 78, cls: "" },
  { quiz: "Quiz 2 — Photosynthesis", avg: 52, cls: "amber" },
  { quiz: "Quiz 3 — Soil Science", avg: 64, cls: "" },
  { quiz: "Final Assessment", avg: 71, cls: "" },
];

const COURSE_SELECT = ["All Courses", "Crop Science 101", "Soil Health & Nutrition", "Irrigation Systems"];

const TeacherAnalytics = () => {
  const [course, setCourse] = useState("All Courses");
  const [stats, setStats] = useState({
    avgCompletion: 63,
    activeStudents: 98,
    avgQuizScore: 66,
    engagementRate: 74,
    engagement: ENGAGEMENT,
    completion: COMPLETION,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/teacher/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("fetchAnalytics error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      {/* Filter */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <span className="td-card-title">Analytics — </span>
        <select className="td-select" style={{ width: "auto", padding: "0.5rem 1rem" }} value={course} onChange={e => setCourse(e.target.value)}>
          {COURSE_SELECT.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Hero KPIs */}
      <div className="tana-hero">
        <div className="tana-hero-card">
          <BookOpen size={28} color="#059669" />
          <p>Avg Completion</p>
          <strong>{stats.avgCompletion}%</strong>
          <span>↑ 4% this week</span>
        </div>
        <div className="tana-hero-card">
          <Users size={28} color="#2563eb" />
          <p>Active Students</p>
          <strong>{stats.activeStudents}</strong>
          <span>↑ 12 new</span>
        </div>
        <div className="tana-hero-card">
          <Star size={28} color="#f59e0b" />
          <p>Avg Quiz Score</p>
          <strong>{stats.avgQuizScore}%</strong>
          <span>↓ 2% vs last month</span>
        </div>
        <div className="tana-hero-card">
          <Target size={28} color="#7c3aed" />
          <p>Engagement Rate</p>
          <strong>{stats.engagementRate}%</strong>
          <span>↑ 5% this week</span>
        </div>
      </div>

      {loading && <div className="td-loading"><div className="td-spinner" /></div>}

      {/* Charts Row */}
      <div className="tana-grid">
        {/* Engagement */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📊 Student Engagement by Course</span>
          </div>
          <div className="td-card-body">
            <div className="tana-bar-chart">
              {stats.engagement.map((e, i) => (
                <div key={i} className="tana-bar-row">
                  <div className="tana-bar-label">{e.label}</div>
                  <div className="tana-bar-wrap">
                    <div className={`tana-bar ${e.cls || ""}`} style={{ width: `${e.pct}%` }} />
                  </div>
                  <div className="tana-bar-pct">{e.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completion */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">✅ Course Completion Rate</span>
          </div>
          <div className="td-card-body">
            <div className="tana-bar-chart">
              {stats.completion.map((e, i) => (
                <div key={i} className="tana-bar-row">
                  <div className="tana-bar-label">{e.label}</div>
                  <div className="tana-bar-wrap">
                    <div className={`tana-bar ${e.cls || ""}`} style={{ width: `${e.pct}%` }} />
                  </div>
                  <div className="tana-bar-pct">{e.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tana-grid" style={{ marginTop: "1.5rem" }}>
        {/* Lesson Drop-off */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📉 Lesson Drop-off Analysis</span>
            <span className="td-badge td-badge-red">Action Required</span>
          </div>
          {DROPOFF.map((d, i) => (
            <div key={i} className="tana-dropoff-row">
              <div className="tana-lesson-num">{d.lesson}</div>
              <div className="tana-lesson-title">{d.title}</div>
              <div className={`tana-dropoff-pct ${d.cls}`}>{d.dropoff}% dropped</div>
            </div>
          ))}
        </div>

        {/* Quiz Performance */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">🧠 Quiz Performance</span>
          </div>
          <div className="td-card-body">
            <div className="tana-bar-chart">
              {QUIZ_PERF.map((q, i) => (
                <div key={i} className="tana-bar-row">
                  <div className="tana-bar-label" style={{ fontSize: "0.7rem", width: "160px" }}>{q.quiz}</div>
                  <div className="tana-bar-wrap">
                    <div className={`tana-bar ${q.cls}`} style={{ width: `${q.avg}%` }} />
                  </div>
                  <div className="tana-bar-pct">{q.avg}%</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", padding: "0.875rem", background: "#fef3c7", borderRadius: "0.75rem", border: "1px solid #fde68a" }}>
              <p style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 600, margin: 0 }}>
                ⚠️ <strong>Quiz 2</strong> has an average of 52% — consider reviewing lesson content or providing additional support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
