import { useEffect, useState } from "react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  BookOpen,
} from "lucide-react";
import CourseEditModal from "./CourseEditModal";
import CourseAddModal from "./CourseAddModal";
import { CourseCard } from '@elearning/shared';
import "@elearning/shared/styles/AdminDashboard/CourseManagement.css";

interface Course {
  id: string;
  title: string;
  short_code: string;
  description: string;
  teacher_id: string;
  created_at: string;
  lessons_count?: number;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      // Add mock lessons count for demo (replace with actual data from API)
      const coursesWithStats = response.data.map((course: Course) => ({
        ...course,
        lessons_count: Math.floor(Math.random() * 20) + 5, // Mock data
      }));
      setCourses(coursesWithStats);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    )
      return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted successfully");
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleEdit = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (course) setSelectedCourse(course);
  };

  const handleAddCourse = () => {
    setShowAddModal(true);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="course-management">
      <div className="course-header">
        <div className="course-title-section">
          <h2>Course Management</h2>
          <p>Manage your system's educational content</p>
        </div>

        <div className="action-bar">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search courses by title, code, or description..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="add-course-btn" onClick={handleAddCourse}>
            <Plus size={18} />
            <span>New Course</span>
          </button>
        </div>
      </div>

      <div className="course-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>No courses found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search term</p>
            )}
            {!searchTerm && (
              <button className="add-course-btn" onClick={handleAddCourse}>
                <Plus size={18} /> Create your first course
              </button>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              viewMode="admin"
            />
          ))
        )}
      </div>

      {selectedCourse && (
        <CourseEditModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSuccess={fetchCourses}
        />
      )}
      {showAddModal && (
        <CourseAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCourses}
        />
      )}
    </div>
  );
};

export default CourseManagement;
