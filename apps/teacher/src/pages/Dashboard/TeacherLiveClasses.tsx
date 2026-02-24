import { useState, useEffect } from "react";
import {
  Radio, Video, Calendar, Clock, Users, Link, Plus, Play, SquarePlay,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherLiveClasses.css";

interface Session {
  id: string; title: string; course: string; date: string; time: string;
  duration: string; attendees: number; maxStudents: number;
  isLive: boolean; recordingUrl?: string; liveUrl?: string; status?: string;
  units?: { title: string };
}

const DEMO_SESSIONS: Session[] = [
  { id: "1", title: "Crop Science Q&A Session", course: "Crop Science 101", date: "Feb 19, 2026", time: "10:00 AM", duration: "60 min", attendees: 34, maxStudents: 48, isLive: true },
  { id: "2", title: "Soil Testing Workshop", course: "Soil Health & Nutrition", date: "Feb 21, 2026", time: "2:00 PM", duration: "90 min", attendees: 0, maxStudents: 31, isLive: false },
  { id: "3", title: "Irrigation Design Review", course: "Irrigation Systems", date: "Feb 25, 2026", time: "11:00 AM", duration: "45 min", attendees: 0, maxStudents: 19, isLive: false },
];

const PAST_SESSIONS: any[] = [
  { title: "Introduction Live Lecture", course: "Crop Science 101", date: "Feb 10, 2026", attendees: 42, recordingUrl: "#" },
  { title: "Fertiliser Application Demo", course: "Soil Health", date: "Feb 7, 2026", attendees: 29, recordingUrl: "#" },
  { title: "Water Flow Calculations", course: "Irrigation Systems", date: "Feb 3, 2026", attendees: 15, recordingUrl: "#" },
];

const TeacherLiveClasses = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", unit_id: "", date: "", time: "", duration: "60 min" });
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, unitsRes] = await Promise.all([
          api.get("/lecturer/live-classes"),
          api.get("/lecturer/units")
        ]);
        setSessions(sessionsRes.data || []);
        setUnits(unitsRes.data || []);
        if (unitsRes.data?.length) {
          setForm(prev => ({ ...prev, unit_id: unitsRes.data[0].id }));
        }
      } catch (err) {
        console.error("fetchData error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcoming = sessions.filter(s => !s.isLive);
  const live     = sessions.filter(s => s.isLive);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/lecturer/live-classes", form);
      setSessions(prev => [...prev, res.data]);
      toast.success("Live class scheduled!");
      setShowModal(false);
    } catch {
      toast.error("Failed to schedule live class");
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="tlc-top">
        <div className="tlc-stat">
          <Radio size={28} />
          <p>Live Now</p>
          <strong>{live.length}</strong>
        </div>
        <div className="tlc-stat">
          <Calendar size={28} />
          <p>Upcoming</p>
          <strong>{upcoming.length}</strong>
        </div>
        <div className="tlc-stat">
          <Video size={28} />
          <p>Recordings</p>
          <strong>{PAST_SESSIONS.length}</strong>
        </div>
      </div>

      {loading && <div className="td-loading"><div className="td-spinner" /></div>}

      {/* Live Sessions */}
      {live.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="td-card-header" style={{ background: "transparent", borderBottom: "none", padding: "0 0 0.75rem 0" }}>
            <span className="td-card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "teacher-pulse 1s infinite" }} />
              Live Now
            </span>
          </div>
          <div className="tlc-sessions-grid">
            {live.map(s => (
              <div key={s.id} className="tlc-session-card">
                <div className="tlc-session-top">
                  <div className="tlc-live-badge"><div className="tlc-live-dot" /> LIVE</div>
                  <div className="tlc-session-course">{s.units?.title || s.course}</div>
                  <div className="tlc-session-title">{s.title}</div>
                  <div className="tlc-session-time"><Clock size={13} /> {s.time} · {s.duration}</div>
                </div>
                <div className="tlc-session-body">
                  <div className="tlc-session-info">
                    <div className="tlc-info-row"><Users size={14} /> {s.attendees} / {s.maxStudents} attending</div>
                  </div>
                  <div className="tlc-session-actions">
                    <button 
                      className="td-btn td-btn-primary" 
                      style={{ flex: 1 }}
                      onClick={() => s.liveUrl && window.open(s.liveUrl, '_blank')}
                    >
                      <Play size={14} /> Join Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="td-card" style={{ marginBottom: "1.5rem" }}>
        <div className="td-card-header">
          <span className="td-card-title">📅 Upcoming Sessions</span>
          <button className="td-btn td-btn-primary td-btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Schedule
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div className="td-empty"><Calendar size={40} /><p>No upcoming sessions</p></div>
        ) : (
          <div className="tlc-sessions-grid" style={{ padding: "1.25rem" }}>
            {upcoming.map(s => (
              <div key={s.id} className="tlc-session-card">
                <div className="tlc-session-top">
                  <div className="tlc-session-course">{s.units?.title || s.course}</div>
                  <div className="tlc-session-title">{s.title}</div>
                  <div className="tlc-session-time"><Calendar size={13} /> {s.date} · {s.time}</div>
                </div>
                <div className="tlc-session-body">
                  <div className="tlc-session-info">
                    <div className="tlc-info-row"><Clock size={14} /> {s.duration}</div>
                    <div className="tlc-info-row"><Users size={14} /> {s.maxStudents} students enrolled</div>
                  </div>
                  <div className="tlc-session-actions">
                    <button 
                      className="td-btn td-btn-outline" 
                      style={{ flex: 1 }}
                      onClick={() => {
                        if (s.liveUrl) {
                          navigator.clipboard.writeText(s.liveUrl);
                          toast.success("Link copied!");
                        }
                      }}
                    >
                      <Link size={13} /> Copy Link
                    </button>
                    <button 
                      className="td-btn td-btn-primary td-btn-sm"
                      onClick={() => s.liveUrl && window.open(s.liveUrl, '_blank')}
                    >
                      <Play size={13} /> Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div className="td-card">
        <div className="td-card-header"><span className="td-card-title">🎬 Past Recordings</span></div>
        {PAST_SESSIONS.map((s, i) => (
          <div key={i} className="tlc-past-row">
            <div className="tlc-past-icon"><SquarePlay size={18} /></div>
            <div className="tlc-past-info">
              <div className="tlc-past-title">{s.title}</div>
              <div className="tlc-past-meta">{s.units?.title || s.course} · {s.date} · {s.attendees} attended</div>
            </div>
            <a href={s.recordingUrl} className="td-btn td-btn-outline td-btn-sm">
              <Video size={13} /> Watch
            </a>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="td-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title"><div className="td-modal-title-icon"><Radio size={18} /></div> Schedule Live Class</div>
              <button className="td-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="td-modal-body">
                <div className="td-form-group">
                  <label className="td-label">Session Title *</label>
                  <input className="td-input" required placeholder="e.g. Week 3 Q&A"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                 <div className="td-form-group">
                  <label className="td-label">Unit</label>
                  <select className="td-select" value={form.unit_id} onChange={e => setForm({ ...form, unit_id: e.target.value })}>
                    {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                  </select>
                </div>
                <div className="td-form-row">
                  <div className="td-form-group">
                    <label className="td-label">Date *</label>
                    <input type="date" className="td-input" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="td-form-group">
                    <label className="td-label">Time *</label>
                    <input type="time" className="td-input" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div className="td-form-group">
                  <label className="td-label">Duration</label>
                  <select className="td-select" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                    <option value="120 min">120 min</option>
                  </select>
                </div>
              </div>
              <div className="td-modal-footer">
                <button type="button" className="td-btn td-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="td-btn td-btn-primary"><Radio size={14} /> Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLiveClasses;
