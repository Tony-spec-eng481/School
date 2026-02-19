import { useEffect, useState } from "react";
import { axiosInstance as api } from '@elearning/shared';
import {
  Save,
  X,
  User,
  Tag,
  Layers,
  Archive,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import "@elearning/shared/styles/AdminDashboard/CourseEditModal.css";

interface Props {
  course: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CourseEditModal = ({ course, onClose, onSuccess }: Props) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: course.title || "",
    teacher_id: course.teacher_id || "",
    category_id: course.category_id || "",
    status: course.status || "draft",
    tags: course.tags?.join(", ") || "",
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

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t !== ""),
      };
      await api.patch(`/admin/courses/${course.id}/status`, payload);
      toast.success("Course updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "pending":
        return "warning";
      case "archived":
        return "danger";
      default:
        return "muted";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <BookOpen size={24} className="text-primary" />
            <span>Manage Course</span>
            <span className="course-code">{course.short_code}</span>
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
                  <User size={16} />
                  Assigned Teacher
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

              <div className="form-grid">
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
                    <Archive size={16} />
                    Status
                  </label>
                  <div className="input-wrapper">
                    <Archive className="input-icon" size={18} />
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="pending">⏳ Pending Review</option>
                      <option value="published">✅ Published</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>
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
                  Separate tags with commas (e.g., "react, javascript,
                  beginner")
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
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

export default CourseEditModal;
