import { useEffect, useState } from "react";
import { axiosInstance as api } from '@elearning/shared';
import {
  Save,
  X,
  User,
  Tag,
  Layers,
  BookOpen,
  AlertCircle,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";
import "@elearning/shared/styles/AdminDashboard/CourseEditModal.css"; // Reuse existing styles

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const CourseAddModal = ({ onClose, onSuccess }: Props) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    short_code: "",
    description: "",
    teacher_id: "",
    category_id: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const [tRes, cRes] = await Promise.all([
          api.get("/admin/users?role=teacher"),
          api
            .get("/admin/settings?key=course_categories")
            .catch(() => ({ data: [] })),
        ]);
        setTeachers(tRes.data);
        setCategories(cRes.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!formData.short_code.trim()) {
      toast.error("Short code is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t !== ""),
      };
      await api.post("/admin/courses", payload);
      toast.success("Course added successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <BookOpen size={24} className="text-primary" />
            <span>Add New Course</span>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {fetching ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading form data...</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">
                  <BookOpen size={16} />
                  Course Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Introduction to React"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Hash size={16} />
                  Short Code
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="REACT101"
                  value={formData.short_code}
                  onChange={(e) =>
                    setFormData({ ...formData, short_code: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Course description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Assign Teacher
                </label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <select
                    className="form-select"
                    value={formData.teacher_id}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher_id: e.target.value })
                    }
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.teacher_details?.teacher_id || "No ID"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Layers size={16} />
                  Category
                </label>
                <div className="input-wrapper">
                  <Layers className="input-icon" size={18} />
                  <select
                    className="form-select"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e.target.value,
                      })
                    }
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Tag size={16} />
                  Tags
                </label>
                <div className="input-wrapper">
                  <Tag className="input-icon" size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="react, frontend, web"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>
                <div className="helper-text">
                  <AlertCircle size={12} />
                  Separate tags with commas (e.g., "react, javascript")
                </div>
              </div>

              <div className="action-buttons">
                <button
                  type="button"
                  onClick={onClose}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="save-button"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Add Course
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

// Simple icon replacement for FileText since I didn't import it initially
const FileText = ({ size, className }: { size?: number; className?: string }) => (
  <BookOpen size={size} className={className} />
);

export default CourseAddModal;
