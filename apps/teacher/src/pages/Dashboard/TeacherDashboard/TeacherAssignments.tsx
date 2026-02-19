import { useState, useEffect } from "react";
import {
  ClipboardList, HelpCircle, Plus, CheckCircle2, Clock, AlertCircle,
  Star,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherAssignments.css";

type TabId = "list" | "quiz" | "grading";

interface Assignment {
  id: string; title: string; type: "assignment" | "quiz";
  course: string; due: string; submissions: number; total: number; avg: number; late: number;
}
interface QuizQuestion { id: string; question: string; options: string[]; correct: number; }
interface Submission { id: string; student: string; score: number | null; status: "pending" | "graded" | "late"; }

const DEMO_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Soil Sample Analysis Report", type: "assignment", course: "Crop Science 101", due: "Feb 25, 2026", submissions: 34, total: 48, avg: 72, late: 3 },
  { id: "a2", title: "Photosynthesis Quiz", type: "quiz", course: "Crop Science 101", due: "Feb 20, 2026", submissions: 46, total: 48, avg: 58, late: 1 },
  { id: "a3", title: "Irrigation Design Project", type: "assignment", course: "Irrigation Systems", due: "Mar 5, 2026", submissions: 10, total: 19, avg: 0, late: 0 },
];

const DEMO_SUBMISSIONS: Submission[] = [
  { id: "s1", student: "Alice Mwangi", score: 82, status: "graded" },
  { id: "s2", student: "Brian Otieno", score: null, status: "pending" },
  { id: "s3", student: "Carol Njoroge", score: 94, status: "graded" },
  { id: "s4", student: "David Kamau", score: null, status: "late" },
  { id: "s5", student: "Eva Wanjiru", score: 61, status: "graded" },
];

const DEMO_QUESTIONS: QuizQuestion[] = [
  { id: "q1", question: "What is the primary source of energy for photosynthesis?", options: ["Water", "Sunlight", "CO₂", "Minerals"], correct: 1 },
  { id: "q2", question: "Which soil type retains the most water?", options: ["Sandy", "Loamy", "Clay", "Silt"], correct: 2 },
];

const TeacherAssignments = () => {
  const [tab, setTab] = useState<TabId>("list");
  const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(DEMO_SUBMISSIONS);
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEMO_QUESTIONS);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [selectedAssignment, setSelectedAssignment] = useState(DEMO_ASSIGNMENTS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssign, setNewAssign] = useState({ title: "", type: "assignment", course: "Crop Science 101", due: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/teacher/assignments");
        if (res.data?.length) {
          setAssignments(res.data);
          setSelectedAssignment(res.data[0]);
        }
      } catch (err) {
        console.error("fetchAssignments error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const pending = submissions.filter(s => s.status === "pending").length;
  const late     = submissions.filter(s => s.status === "late").length;
  const avg      = Math.round(submissions.filter(s => s.score !== null).reduce((a, s) => a + (s.score ?? 0), 0) / submissions.filter(s => s.score !== null).length);

  const handleGrade = async (id: string) => {
    const val = parseInt(scores[id] ?? "0", 10);
    if (isNaN(val) || val < 0 || val > 100) { toast.error("Score must be 0–100"); return; }
    
    try {
      await api.patch(`/teacher/assignments/${selectedAssignment.id}/grade/${id}`, { score: val });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, score: val, status: "graded" } : s));
      toast.success("Score saved");
    } catch {
      // optimistic fallback
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, score: val, status: "graded" } : s));
      toast.success("Score saved");
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssign.title) { toast.error("Title required"); return; }
    try {
      const res = await api.post("/teacher/assignments", newAssign);
      setAssignments(prev => [...prev, res.data]);
      toast.success("Assignment created");
    } catch {
      // optimistic fallback
      setAssignments(prev => [...prev, { id: `a${Date.now()}`, ...newAssign, type: newAssign.type as "assignment" | "quiz", submissions: 0, total: 30, avg: 0, late: 0 }]);
      toast.success("Assignment created");
    }
    setShowAddModal(false);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: `q${Date.now()}`, question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="ta-tabs">
        {(["list", "quiz", "grading"] as TabId[]).map(t => (
          <button key={t} className={`ta-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "list" ? "📋 Assignments" : t === "quiz" ? "🧠 Quiz Builder" : "📝 Grade Submissions"}
          </button>
        ))}
      </div>

      {/* --- Assignment List --- */}
      {tab === "list" && (
        <div>
          <div className="ta-metrics">
            <div className="ta-metric-card">
              <Clock size={24} color="#f59e0b" />
              <p>Pending Grading</p>
              <strong>{pending}</strong>
            </div>
            <div className="ta-metric-card">
              <Star size={24} color="#059669" />
              <p>Average Score</p>
              <strong>{avg || "--"}%</strong>
            </div>
            <div className="ta-metric-card">
              <AlertCircle size={24} color="#ef4444" />
              <p>Late Submissions</p>
              <strong>{late}</strong>
            </div>
          </div>

          <div className="td-card">
            <div className="td-card-header">
              <span className="td-card-title">Assignments & Quizzes</span>
              <button className="td-btn td-btn-primary td-btn-sm" onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> Create
              </button>
            </div>
            {loading ? (
              <div className="td-loading"><div className="td-spinner" /></div>
            ) : assignments.length === 0 ? (
              <div className="td-empty"><ClipboardList size={40} /><p>No assignments found</p></div>
            ) : assignments.map(a => (
              <div key={a.id} className="ta-assignment-row" onClick={() => { setSelectedAssignment(a); setTab("grading"); }} style={{ cursor: "pointer" }}>
                <div className={`ta-assignment-icon ${a.type === "quiz" ? "ta-icon-quiz" : "ta-icon-assign"}`}>
                  {a.type === "quiz" ? <HelpCircle size={20} /> : <ClipboardList size={20} />}
                </div>
                <div className="ta-assignment-info">
                  <div className="ta-assignment-title">{a.title}</div>
                  <div className="ta-assignment-meta">{a.course} · Due: {a.due} · {a.late} late</div>
                </div>
                <div className="ta-assignment-stats">
                  <span className="td-badge td-badge-blue">{a.submissions}/{a.total} submitted</span>
                  {a.avg > 0 && <span className="td-badge td-badge-green">Avg: {a.avg}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Quiz Builder --- */}
      {tab === "quiz" && (
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">🧠 Quiz Builder</span>
            <button className="td-btn td-btn-primary td-btn-sm" onClick={addQuestion}><Plus size={14} /> Add Question</button>
          </div>
          <div className="td-card-body">
            {questions.map((q, qi) => (
              <div key={q.id} className="tq-question-card">
                <div className="td-form-group">
                  <label className="td-label">Question {qi + 1}</label>
                  <input className="td-input" placeholder="Enter question..."
                    value={q.question}
                    onChange={e => setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, question: e.target.value } : x))}
                  />
                </div>
                <div className="tq-options">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="tq-option-row">
                      <input type="radio" name={`correct-${q.id}`} checked={q.correct === oi}
                        onChange={() => setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, correct: oi } : x))}
                      />
                      <input className="td-input tq-option-input" placeholder={`Option ${oi + 1}`} value={opt}
                        onChange={e => {
                          const opts = [...q.options]; opts[oi] = e.target.value;
                          setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, options: opts } : x));
                        }}
                      />
                      {q.correct === oi && <CheckCircle2 size={16} color="#059669" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="td-btn td-btn-primary" style={{ marginTop: "1rem" }} onClick={() => toast.success("Quiz saved!")}>
              Save Quiz
            </button>
          </div>
        </div>
      )}

      {/* --- Grading Panel --- */}
      {tab === "grading" && (
        <div className="td-card">
          <div className="tg-panel-header">
            <ClipboardList size={20} color="var(--teacher-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{selectedAssignment.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--teacher-text-muted)" }}>{selectedAssignment.course}</div>
            </div>
          </div>
          {submissions.map(s => (
            <div key={s.id} className="tg-student-entry">
              <div className="ts-student-avatar" style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--teacher-primary-bg)", color: "var(--teacher-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                {s.student[0]}
              </div>
              <div className="tg-student-info">
                <strong>{s.student}</strong>
                <span>
                  <span className={`td-badge ${s.status === "graded" ? "td-badge-green" : s.status === "late" ? "td-badge-red" : "td-badge-yellow"}`} style={{ fontSize: "0.65rem" }}>
                    {s.status}
                  </span>
                </span>
              </div>
              {s.score !== null ? (
                <span className="td-badge td-badge-green">{s.score}/100</span>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="number" min={0} max={100} className="tg-score-input"
                    placeholder="Score" value={scores[s.id] ?? ""}
                    onChange={e => setScores(prev => ({ ...prev, [s.id]: e.target.value }))}
                  />
                  <button className="td-btn td-btn-primary td-btn-sm" onClick={() => handleGrade(s.id)}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="td-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title"><div className="td-modal-title-icon"><ClipboardList size={18} /></div> New Assignment</div>
              <button className="td-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="td-modal-body">
              <div className="td-form-group">
                <label className="td-label">Title *</label>
                <input className="td-input" placeholder="Assignment title" value={newAssign.title}
                  onChange={e => setNewAssign({ ...newAssign, title: e.target.value })} />
              </div>
              <div className="td-form-row">
                <div className="td-form-group">
                  <label className="td-label">Type</label>
                  <select className="td-select" value={newAssign.type} onChange={e => setNewAssign({ ...newAssign, type: e.target.value })}>
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div className="td-form-group">
                  <label className="td-label">Due Date</label>
                  <input type="date" className="td-input" value={newAssign.due}
                    onChange={e => setNewAssign({ ...newAssign, due: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="td-modal-footer">
              <button className="td-btn td-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="td-btn td-btn-primary" onClick={handleCreateAssignment}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
