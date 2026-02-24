import { useState, useEffect } from "react";
import {
  Users, Search, Download, MessageSquare, UserMinus,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherStudents.css";

interface Student {
  id: string; name: string; email: string;
  progress: number; completion: number; last_activity: string; enrolled_at: string;
}

interface Course { id: string; title: string; }

const ProgressBar = ({ value }: { value: number }) => (
  <div className="ts-progress-wrap">
    <div className="ts-progress-bar">
      <div className="ts-progress-fill" style={{ width: `${value}%` }} />
    </div>
    <span className="ts-progress-label">{value}%</span>
  </div>
);   

const TeacherStudents = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch teacher's units for the tab bar
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await api.get("/lecturer/units");
        setUnits(res.data);
        if (res.data?.length) setSelectedUnitId(res.data[0].id);
      } catch {
        const demo = [
          { id: "1", title: "Crop Production" },
          { id: "2", title: "Soil Health & Nutrition" },
        ];
        setUnits(demo);
        setSelectedUnitId(demo[0].id);
      }
    };
    fetchUnits();
  }, []);

  // Fetch students whenever selected unit changes
  useEffect(() => {
    if (!selectedUnitId) return;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/lecturer/units/${selectedUnitId}/students`);
        setStudents(res.data);
      } catch {
        // demo fallback
        setStudents([
          { id: "s1", name: "Alice Mwangi", email: "alice@example.com", progress: 78, completion: 65, last_activity: "2 hrs ago", enrolled_at: "Jan 10, 2026" },
          { id: "s2", name: "Brian Otieno", email: "otieno@example.com", progress: 52, completion: 40, last_activity: "1 day ago", enrolled_at: "Jan 15, 2026" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedUnitId]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const avgProgress = students.length
    ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)
    : 0;
  const completed = students.filter(s => s.completion >= 80).length;

  const handleDrop = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from this course?`)) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success(`${name} removed from course`);
  };

  return (
    <div>
      {/* Summary */}
      <div className="ts-summary-row">
        <div className="ts-summary-card"><p>Enrolled</p><strong>{students.length}</strong></div>
        <div className="ts-summary-card"><p>Avg Progress</p><strong>{avgProgress}%</strong></div>
        <div className="ts-summary-card"><p>Completed</p><strong>{completed}</strong></div>
        <div className="ts-summary-card"><p>Active Today</p><strong>{students.filter(s => s.last_activity.includes("min") || s.last_activity.includes("hr")).length}</strong></div>
      </div>

      {/* Unit Tabs */}
      <div className="ts-course-bar">
        {units.map(u => (
          <button
            key={u.id}
            className={`ts-course-tab ${selectedUnitId === u.id ? "active" : ""}`}
            onClick={() => setSelectedUnitId(u.id)}
          >
            {u.title}
          </button>
        ))}
      </div>

      <div className="td-card">
        <div className="td-card-header">
          <span className="td-card-title"><Users size={18} /> Enrolled Students</span>
          <div className="ts-actions-row" style={{ marginBottom: 0 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={15} style={{ position: "absolute", left: "0.75rem", color: "var(--teacher-text-muted)" }} />
              <input
                style={{ paddingLeft: "2.25rem", padding: "0.5rem 1rem 0.5rem 2.25rem", border: "1.5px solid var(--teacher-border)", borderRadius: "0.625rem", fontSize: "0.875rem", background: "white", width: "200px" }}
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="td-btn td-btn-outline td-btn-sm">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="td-loading"><div className="td-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="td-empty"><Users size={40} /><p>No students found</p></div>
        ) : (
          <div className="td-table-wrap">
            <table className="td-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Progress</th>
                  <th>Completion</th>
                  <th>Last Active</th>
                  <th>Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="ts-student-name">
                        <div className="ts-student-avatar">{s.name[0]}</div>
                        <div className="ts-name-info">
                          <strong>{s.name}</strong>
                          <span>{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><ProgressBar value={s.progress} /></td>
                    <td>
                      <span className={`td-badge ${s.completion >= 80 ? "td-badge-green" : s.completion >= 50 ? "td-badge-yellow" : "td-badge-red"}`}>
                        {s.completion}%
                      </span>
                    </td>
                    <td style={{ color: "var(--teacher-text-muted)", fontSize: "0.8rem" }}>{s.last_activity}</td>
                    <td style={{ color: "var(--teacher-text-muted)", fontSize: "0.8rem" }}>{s.enrolled_at}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="td-btn td-btn-outline td-btn-sm" title="Message student">
                          <MessageSquare size={13} />
                        </button>
                        <button className="td-btn td-btn-danger td-btn-sm" onClick={() => handleDrop(s.id, s.name)} title="Drop student">
                          <UserMinus size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;
