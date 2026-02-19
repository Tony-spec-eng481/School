import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance as api } from '@elearning/shared';
import {
  Clock,
  Star,
  ChevronRight,
  Users,
  BookOpen,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import "@elearning/shared/styles/AdminDashboard/TeacherManagement.css";

interface TeacherStats {
  courses: number;
  students: number;
  rating: string;
  activity: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  teacher_details?: {
    teacher_id: string;
  };
  stats: TeacherStats;
}

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/admin/users?role=teacher");
        // Mocking performance data for demo
        const teachersWithStats = response.data.map((t: any) => ({
          ...t,
          stats: {
            courses: Math.floor(Math.random() * 5) + 1,
            students: Math.floor(Math.random() * 500) + 100,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            activity: "98%",
          },
        }));
        setTeachers(teachersWithStats);
      } catch (error) {
        toast.error("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const getLastActive = () => {
    const hours = Math.floor(Math.random() * 8);
    const minutes = Math.floor(Math.random() * 60);
    return `Today, ${hours + 9}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  };

  const handleViewReport = (teacherId: string) => {
    navigate(`/reports/teacher/${teacherId}`);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Teacher Management...</p>
      </div>
    );
  }
  
  return (
    <div className="teacher-management">
      <div className="teacher-space">
        <div className="teacher-header">
          <h2 className="header-title">Teacher Performance & Activity</h2>
          <div className="stats-badge">
            <Users size={16} />
            Active Staff
            <span>{teachers.length}</span>
          </div>
        </div>

        <div className="teachers-grid">
          {teachers.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" size={48} />
              <p>No teachers found</p>
            </div>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="card-header">
                  <div className="teacher-profile">
                    <div className="teacher-avatar">{teacher.name[0]}</div>
                    <div className="teacher-info">
                      <h3 className="teacher-name">{teacher.name}</h3>
                      <span className="teacher-id">
                        {teacher.teacher_details?.teacher_id || "FACULTY"}
                      </span>
                    </div>
                  </div>
                  <div className="rating-section">
                    <div className="rating-value">
                      <Star
                        className="rating-star"
                        size={16}
                        fill="currentColor"
                      />
                      {teacher.stats.rating}
                    </div>
                    <span className="rating-label">Avg Rating</span>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <BookOpen className="stat-icon" size={16} />
                    <p className="stat-value">{teacher.stats.courses}</p>
                    <p className="stat-label">Courses</p>
                  </div>
                  <div className="stat-item">
                    <Users className="stat-icon" size={16} />
                    <p className="stat-value">{teacher.stats.students}</p>
                    <p className="stat-label">Students</p>
                  </div>
                  <div className="stat-item">
                    <Activity className="stat-icon" size={16} />
                    <p className="stat-value">{teacher.stats.activity}</p>
                    <p className="stat-label">Activity</p>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="last-active">
                    <Clock size={14} />
                    Last active: {getLastActive()}
                  </div>
                  <button
                    className="report-button"
                    onClick={() => handleViewReport(teacher.id)}
                  >
                    Full Report <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Section */}
        {teachers.length > 0 && (
          <div className="summary-section">
            <div className="summary-item">
              <span className="summary-label">Average Rating</span>
              <span className="summary-value">
                {(
                  teachers.reduce(
                    (acc, t) => acc + parseFloat(t.stats.rating),
                    0,
                  ) / teachers.length
                ).toFixed(1)}
                <Star size={14} className="summary-icon" />
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Students</span>
              <span className="summary-value">
                {teachers
                  .reduce((acc, t) => acc + t.stats.students, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Courses</span>
              <span className="summary-value">
                {teachers.reduce((acc, t) => acc + t.stats.courses, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;
