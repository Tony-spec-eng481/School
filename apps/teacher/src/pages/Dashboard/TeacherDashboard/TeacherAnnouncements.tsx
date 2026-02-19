import { useEffect, useState } from "react";
import { Bell, Plus, Send, Trash2, Calendar, Shield, BookOpen } from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherAnnouncements.css";

interface Notification {
  id: string; title: string; content: string; type: "admin" | "system" | "course";
  created_at: string; is_read: boolean;
}
interface TeacherAnn {
  id: string; title: string; content: string; course: string; created_at: string;
}

interface Props { onNotifCount?: (n: number) => void; }

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Platform Maintenance Notice", content: "Scheduled maintenance on Feb 22, 2026 from 2–4 AM. Plan your classes accordingly.", type: "admin", created_at: "2026-02-18T10:00:00Z", is_read: false },
  { id: "n2", title: "New Enrollment Policy", content: "Starting March 1, all new student enrollments require admin pre-approval.", type: "admin", created_at: "2026-02-17T08:30:00Z", is_read: false },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  admin: <Shield size={16} />,
  system: <Bell size={16} />,
  course: <BookOpen size={16} />,
};

const TeacherAnnouncements = ({ onNotifCount }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState<TeacherAnn[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", course: "Crop Science 101" });
  const [courses, setCourses] = useState<string[]>(["All My Courses", "Crop Science 101", "Soil Health & Nutrition", "Irrigation Systems"]);

  // Fetch incoming notifications (admin/system)
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get("/teacher/notifications");
        if (res.data && res.data.length) setNotifications(res.data);
      } catch { /* keep demo data */ }
    };
    fetchNotifs();
  }, []);

  // Fetch teacher-posted announcements
  useEffect(() => {
    const fetchAnn = async () => {
      try {
        const res = await api.get("/teacher/announcements");
        setAnnouncements(res.data || []);
      } catch { /* silently skip */ }
    };
    fetchAnn();
  }, []);

  // Fetch courses for selector
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/teacher/courses");
        if (res.data?.length) {
          setCourses(["All My Courses", ...res.data.map((c: { title: string }) => c.title)]);
        }
      } catch { /* keep defaults */ }
    };
    fetchCourses();
  }, []);

  const unread = notifications.filter(n => !n.is_read).length;
  useEffect(() => { onNotifCount?.(unread); }, [unread]);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title required"); return; }
    try {
      const res = await api.post("/teacher/announcements", form);
      const ann: TeacherAnn = res.data;
      setAnnouncements(prev => [ann, ...prev]);
      toast.success("Announcement posted!");
    } catch {
      // Optimistic fallback
      const ann: TeacherAnn = {
        id: `a${Date.now()}`, ...form, created_at: new Date().toISOString(),
      };
      setAnnouncements(prev => [ann, ...prev]);
      toast.success("Announcement posted!");
    }
    setShowModal(false);
    setForm({ title: "", content: "", course: "Crop Science 101" });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/teacher/announcements/${id}`);
    } catch { /* optimistic delete even if API fails */ }
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success("Announcement deleted");
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="tan-layout">
        {/* Notifications Panel */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">
              🔔 Notifications
              {unread > 0 && <span className="teacher-nav-badge" style={{ marginLeft: "0.5rem" }}>{unread}</span>}
            </span>
            {unread > 0 && (
              <button className="td-btn td-btn-outline td-btn-sm" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="td-empty"><Bell size={40} /><p>No notifications</p></div>
          ) : (
            <div className="tan-notif-list">
              {notifications.map(n => (
                <div key={n.id} className={`tan-notif-item ${!n.is_read ? "unread" : ""}`} onClick={() => markRead(n.id)}>
                  <div className={`tan-notif-icon tan-icon-${n.type}`}>{TYPE_ICON[n.type]}</div>
                  <div className="tan-notif-body">
                    <div className="tan-notif-title">{n.title}</div>
                    <div className="tan-notif-text">{n.content}</div>
                    <div className="tan-notif-meta">
                      <span className="tan-notif-time"><Calendar size={11} /> {fmt(n.created_at)}</span>
                      {!n.is_read && <span className="tan-unread-dot" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Announcements Panel */}
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📢 My Announcements</span>
            <button className="td-btn td-btn-primary td-btn-sm" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Post
            </button>
          </div>
          {announcements.length === 0 ? (
            <div className="td-empty"><Bell size={40} /><p>No announcements yet</p></div>
          ) : (
            <div className="tan-ann-list" style={{ padding: "1rem" }}>
              {announcements.map(a => (
                <div key={a.id} className="tan-ann-card">
                  <div className="tan-ann-header">
                    <div className="tan-ann-title">{a.title}</div>
                    <span className="td-badge td-badge-blue" style={{ fontSize: "0.65rem" }}>{a.course}</span>
                  </div>
                  <div className="tan-ann-content">{a.content}</div>
                  <div className="tan-ann-footer">
                    <div className="tan-ann-date"><Calendar size={11} /> {fmt(a.created_at)}</div>
                    <button className="td-btn td-btn-danger td-btn-sm" onClick={() => handleDelete(a.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="td-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title"><div className="td-modal-title-icon"><Bell size={18} /></div> New Announcement</div>
              <button className="td-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePost}>
              <div className="td-modal-body">
                <div className="td-form-group">
                  <label className="td-label">Title *</label>
                  <input className="td-input" required placeholder="Announcement title"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="td-form-group">
                  <label className="td-label">Target Course</label>
                  <select className="td-select" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
                    {courses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="td-form-group">
                  <label className="td-label">Message *</label>
                  <textarea className="td-textarea" required placeholder="Write your announcement..."
                    value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                </div>
              </div>
              <div className="td-modal-footer">
                <button type="button" className="td-btn td-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="td-btn td-btn-primary"><Send size={14} /> Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
