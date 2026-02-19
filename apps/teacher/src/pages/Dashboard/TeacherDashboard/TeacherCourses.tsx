import { useEffect, useState, useRef } from "react";
import {
  BookOpen, Search, Plus, 
  Trash2, Upload, BarChart2, ChevronDown, MoreVertical, Globe, Lock, Edit2,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import { CourseCard } from '@elearning/shared';
import "@elearning/shared/styles/TeacherDashboard/TeacherCourses.css";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  student_count: number;
  lesson_count: number;
  is_published: boolean;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "td-badge-green",
  intermediate: "td-badge-yellow",
  advanced: "td-badge-red",
};

const DropdownMenu = ({
  course, onPublishToggle, onDelete,
}: {
  course: Course;
  onPublishToggle: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="tc-actions-menu" ref={ref}>
      <button className="tc-actions-trigger" onClick={() => setOpen(!open)}>
        <MoreVertical size={14} /> Actions <ChevronDown size={12} />
      </button>
      {open && (
        <div className="tc-dropdown">
          <button className="tc-dropdown-item"><Edit2 size={15} /> Edit Course</button>
          <button className="tc-dropdown-item"><Plus size={15} /> Add Lesson</button>
          <button className="tc-dropdown-item"><BarChart2 size={15} /> View Analytics</button>
          <button className="tc-dropdown-item"><Upload size={15} /> Upload Materials</button>
          <div className="tc-dropdown-divider" />
          <button
            className="tc-dropdown-item"
            onClick={() => { onPublishToggle(course.id, !course.is_published); setOpen(false); }}
          >
            {course.is_published ? <Lock size={15} /> : <Globe size={15} />}
            {course.is_published ? "Unpublish" : "Publish"}
          </button>
          <div className="tc-dropdown-divider" />
          <button className="tc-dropdown-item danger" onClick={() => { onDelete(course.id); setOpen(false); }}>
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

const TeacherCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Agriculture", difficulty: "beginner",
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get("/teacher/courses");
      setCourses(res.data);
    } catch {
      // Use demo data on error
      setCourses([
        { id: "1", title: "Crop Science 101", description: "Fundamentals of crop production and management for sustainable farming.", category: "Agriculture", difficulty: "beginner", student_count: 48, lesson_count: 12, is_published: true },
        { id: "2", title: "Soil Health & Nutrition", description: "Deep dive into soil chemistry, microbiome, and fertilisation strategies.", category: "Agronomy", difficulty: "intermediate", student_count: 31, lesson_count: 8, is_published: true },
        { id: "3", title: "Irrigation Systems", description: "Modern irrigation techniques including drip, sprinkler, and flood systems.", category: "Engineering", difficulty: "intermediate", student_count: 19, lesson_count: 6, is_published: false },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "published" ? c.is_published : !c.is_published);
    return matchSearch && matchFilter;
  });

  const handlePublishToggle = async (id: string, val: boolean) => {
    try {
      await api.patch(`/teacher/courses/${id}`, { is_published: val });
      setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: val } : c));
      toast.success(val ? "Course published!" : "Course set to draft");
    } catch { toast.error("Failed to update course"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This is permanent.")) return;
    try {
      await api.delete(`/teacher/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success("Course deleted");
    } catch { toast.error("Failed to delete course"); }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/teacher/courses", form);
      toast.success("Course created!");
      setShowModal(false);
      fetchCourses();
    } catch { toast.error("Failed to create course"); }
  };

  if (loading) return <div className="td-loading"><div className="td-spinner" /></div>;

  return (
    <div>
      {/* Toolbar */}
      <div className="tc-toolbar">
        <div className="tc-filters">
          <div className="tc-search-wrap">
            <Search size={16} />
            <input
              className="tc-search"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="tc-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Courses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button className="td-btn td-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Course
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="td-empty">
          <BookOpen size={48} />
          <p>No courses found</p>
          <span>Create your first course to get started</span>
        </div>
      ) : (
        <div className="tc-grid">
          {filtered.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              viewMode="teacher"
            />
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showModal && (
        <div className="td-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title">
                <div className="td-modal-title-icon"><BookOpen size={18} /></div>
                Create New Course
              </div>
              <button className="td-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="td-modal-body">
                <div className="td-form-group">
                  <label className="td-label">Course Title *</label>
                  <input className="td-input" required placeholder="e.g. Advanced Soil Management"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="td-form-group">
                  <label className="td-label">Description</label>
                  <textarea className="td-textarea" placeholder="Short description of the course..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="td-form-row">
                  <div className="td-form-group">
                    <label className="td-label">Category</label>
                    <input className="td-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <div className="td-form-group">
                    <label className="td-label">Difficulty</label>
                    <select className="td-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="td-modal-footer">
                <button type="button" className="td-btn td-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="td-btn td-btn-primary"><Plus size={15} /> Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
