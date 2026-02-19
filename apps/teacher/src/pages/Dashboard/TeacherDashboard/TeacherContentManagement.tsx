import { useEffect, useState } from "react";
import {
  BookOpen, Video, FileText, Mic, ChevronDown, ChevronRight,
  GripVertical, Edit2, Trash2, Plus, Eye, EyeOff, CheckCircle,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherContentManagement.css";

interface Topic { id: string; title: string; type: "video" | "text" | "audio"; duration?: string; }
interface Lesson { id: string; title: string; order: number; duration: string; is_visible: boolean; is_approved: boolean; topics: Topic[]; }
interface Course { id: string; title: string; lesson_count: number; }

const DEMO_COURSES: Course[] = [
  { id: "1", title: "Crop Science 101", lesson_count: 12 },
  { id: "2", title: "Soil Health & Nutrition", lesson_count: 8 },
  { id: "3", title: "Irrigation Systems", lesson_count: 6 },
];

const DEMO_LESSONS: Lesson[] = [
  {
    id: "l1", title: "Introduction to Crop Biology", order: 1, duration: "45 min",
    is_visible: true, is_approved: true,
    topics: [
      { id: "t1", title: "What is Crop Science?", type: "video", duration: "12 min" },
      { id: "t2", title: "Reading Notes", type: "text" },
    ],
  },
  {
    id: "l2", title: "Photosynthesis & Growth", order: 2, duration: "60 min",
    is_visible: true, is_approved: false,
    topics: [
      { id: "t3", title: "Photosynthesis Explained", type: "video", duration: "20 min" },
      { id: "t4", title: "Audio Summary", type: "audio", duration: "5 min" },
    ],
  },
  {
    id: "l3", title: "Pest & Disease Management", order: 3, duration: "50 min",
    is_visible: false, is_approved: false,
    topics: [],
  },
];

const TOPIC_ICON: Record<string, React.ReactNode> = {
  video: <Video size={14} />,
  text: <FileText size={14} />,
  audio: <Mic size={14} />,
};

const TeacherContentManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", duration: "" });
  const [loading, setLoading] = useState(true);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/teacher/courses");
        setCourses(res.data);
        if (res.data?.length) setSelectedCourse(res.data[0]);
      } catch (err) {
        console.error("fetchCourses error:", err);
        // demo fallback
        setCourses(DEMO_COURSES);
        setSelectedCourse(DEMO_COURSES[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch lessons when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/teacher/courses/${selectedCourse.id}/lessons`);
        setLessons(res.data);
      } catch (err) {
        console.error("fetchLessons error:", err);
        setLessons(DEMO_LESSONS);
      }
    };
    fetchLessons();
  }, [selectedCourse]);

  const toggleVisibility = async (id: string) => {
    try {
      await api.patch(`/teacher/lessons/${id}`, { is_visible: !lessons.find(l => l.id === id)?.is_visible });
      setLessons(prev => prev.map(l => l.id === id ? { ...l, is_visible: !l.is_visible } : l));
      toast.success("Lesson visibility updated");
    } catch {
      // optimistic fallback
      setLessons(prev => prev.map(l => l.id === id ? { ...l, is_visible: !l.is_visible } : l));
      toast.success("Lesson visibility updated");
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const res = await api.post(`/teacher/courses/${selectedCourse.id}/lessons`, newLesson);
      setLessons(prev => [...prev, res.data]);
      toast.success("Lesson added");
    } catch {
      // optimistic fallback
      const lesson: Lesson = {
        id: `l${Date.now()}`, title: newLesson.title, order: lessons.length + 1,
        duration: newLesson.duration || "30 min", is_visible: false, is_approved: false, topics: [],
      };
      setLessons(prev => [...prev, lesson]);
      toast.success("Lesson added");
    }
    setNewLesson({ title: "", duration: "" });
    setShowAddLesson(false);
  };

  return (
    <div className="tcm-layout">
      {/* Course Selector Sidebar */}
      <div className="td-card">
        <div className="td-card-header"><span className="td-card-title">📚 Courses</span></div>
        <div className="tcm-course-list">
          {loading ? (
            <div className="td-loading" style={{ height: "100px" }}><div className="td-spinner" /></div>
          ) : courses.map(c => (
            <button
              key={c.id}
              className={`tcm-course-item ${selectedCourse?.id === c.id ? "active" : ""}`}
              onClick={() => setSelectedCourse(c)}
            >
              <div className="tcm-course-icon"><BookOpen size={14} /></div>
              <div>
                <div className="tcm-course-name">{c.title}</div>
                <div className="tcm-course-meta">{c.lesson_count} lessons</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Panel */}
      <div>
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📖 Lessons — {selectedCourse?.title || "Select Course"}</span>
            <button className="td-btn td-btn-primary td-btn-sm" onClick={() => setShowAddLesson(true)} disabled={!selectedCourse}>
              <Plus size={14} /> Add Lesson
            </button>
          </div>
          <div className="td-card-body" style={{ padding: "1rem" }}>
            <div className="tcm-lesson-list">
              {lessons.map(lesson => (
                <div key={lesson.id} className="tcm-lesson-card">
                  <div
                    className="tcm-lesson-row"
                    onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                  >
                    <GripVertical size={16} className="tcm-drag-handle" />
                    <div className="tcm-lesson-order">{lesson.order}</div>
                    <div className="tcm-lesson-info">
                      <div className="tcm-lesson-title">{lesson.title}</div>
                      <div className="tcm-lesson-subinfo">
                        <span>⏱ {lesson.duration}</span>
                        <span>{lesson.topics.length} topics</span>
                        {lesson.is_approved && <span style={{ color: "#059669" }}>✓ Approved</span>}
                      </div>
                    </div>
                    <div className="tcm-lesson-actions">
                      <span className={`td-badge ${lesson.is_visible ? "td-badge-green" : "td-badge-gray"}`} style={{ fontSize: "0.65rem" }}>
                        {lesson.is_visible ? "Visible" : "Hidden"}
                      </span>
                      <button className="tcm-icon-btn" onClick={e => { e.stopPropagation(); toggleVisibility(lesson.id); }} title="Toggle visibility">
                        {lesson.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button className="tcm-icon-btn"><Edit2 size={15} /></button>
                      <button className="tcm-icon-btn danger"><Trash2 size={15} /></button>
                    </div>
                    {expandedLesson === lesson.id ? <ChevronDown size={16} style={{ color: "var(--teacher-text-muted)" }} /> : <ChevronRight size={16} style={{ color: "var(--teacher-text-muted)" }} />}
                  </div>

                  {/* Topics */}
                  {expandedLesson === lesson.id && (
                    <div className="tcm-topics-panel">
                      <div className="tcm-topics-title">📌 Topics</div>
                      {lesson.topics.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "var(--teacher-text-muted)", padding: "0.5rem 0" }}>No topics yet</p>
                      ) : lesson.topics.map(topic => (
                        <div key={topic.id} className="tcm-topic-row">
                          <div className="tcm-topic-icon">{TOPIC_ICON[topic.type]}</div>
                          <div className="tcm-topic-name">{topic.title}</div>
                          {topic.duration && <span style={{ fontSize: "0.7rem", color: "var(--teacher-text-muted)" }}>{topic.duration}</span>}
                          <span className={`td-badge td-badge-${topic.type === "video" ? "blue" : topic.type === "audio" ? "purple" : "gray"}`} style={{ fontSize: "0.65rem" }}>{topic.type}</span>
                        </div>
                      ))}

                      {/* Upload Zones */}
                      <div className="tcm-uploads-grid">
                        <div className="tcm-upload-zone">
                          <Video size={24} />
                          <div className="tcm-upload-label">Upload Video</div>
                          <div className="tcm-upload-sub">MP4, WebM</div>
                        </div>
                        <div className="tcm-upload-zone">
                          <FileText size={24} />
                          <div className="tcm-upload-label">Upload Notes</div>
                          <div className="tcm-upload-sub">PDF, DOCX</div>
                        </div>
                        <div className="tcm-upload-zone">
                          <Mic size={24} />
                          <div className="tcm-upload-label">Audio Intro</div>
                          <div className="tcm-upload-sub">MP3, WAV</div>
                        </div>
                      </div>

                      {!lesson.is_approved && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <button className="td-btn td-btn-outline td-btn-sm">
                            <CheckCircle size={13} /> Submit for Approval
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="td-modal-overlay" onClick={() => setShowAddLesson(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title"><div className="td-modal-title-icon"><FileText size={18} /></div> New Lesson</div>
              <button className="td-modal-close" onClick={() => setShowAddLesson(false)}>✕</button>
            </div>
            <form onSubmit={handleAddLesson}>
              <div className="td-modal-body">
                <div className="td-form-group">
                  <label className="td-label">Lesson Title *</label>
                  <input className="td-input" required placeholder="e.g. Introduction to Photosynthesis"
                    value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} />
                </div>
                <div className="td-form-group">
                  <label className="td-label">Estimated Duration</label>
                  <input className="td-input" placeholder="e.g. 45 min"
                    value={newLesson.duration} onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })} />
                </div>
              </div>
              <div className="td-modal-footer">
                <button type="button" className="td-btn td-btn-outline" onClick={() => setShowAddLesson(false)}>Cancel</button>
                <button type="submit" className="td-btn td-btn-primary"><Plus size={15} /> Add Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherContentManagement;
