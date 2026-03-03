// AvailableCourses.tsx
import React, { useState, useEffect } from "react";
import { studentApi } from "@elearning/shared";
import toast from "react-hot-toast";
import { FiSearch, FiBookOpen, FiClock, FiLayers, FiCheckCircle, FiPlus } from "react-icons/fi";
import "../styles/AvailableCourses.css";

interface Course {
  id: string;
  title: string;
  description: string;
  shortCode: string;
  thumbnail: string | null;
  difficulty: string;
  durationWeeks: number;
  department: string;
  isEnrolled: boolean;
  isCompleted: boolean;
  canEnroll: boolean;
}

const AvailableCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await studentApi.getAvailableCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching available courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await studentApi.enrollInCourse(courseId);
      toast.success(res.data.message || "Enrolled successfully!");
      // Refresh courses to update enrollment status
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  };

  const activeEnrollments = courses.filter(
    (c) => c.isEnrolled && !c.isCompleted
  ).length;

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shortCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyClass = (d: string) => {
    const lower = (d || "").toLowerCase();
    if (lower === "beginner") return "difficulty-beginner";
    if (lower === "intermediate") return "difficulty-intermediate";
    if (lower === "advanced") return "difficulty-advanced";
    return "difficulty-beginner";
  };

  const getButtonLabel = (course: Course) => {
    if (course.isCompleted) return "Completed";
    if (course.isEnrolled) return "Enrolled";
    if (!course.canEnroll) return "Max 2 Courses";
    return "Enroll";
  };

  const getButtonClass = (course: Course) => {
    if (course.isCompleted) return "btn-enroll completed-course";
    if (course.isEnrolled) return "btn-enroll enrolled";
    if (!course.canEnroll) return "btn-enroll max-reached";
    return "btn-enroll";
  };

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="courses-loading-spinner"></div>
        <p className="courses-loading-text">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="available-courses-container">
      <div className="courses-header">
        <h1 className="courses-header-title">Available Courses</h1>
        <div className="courses-header-info">
          <span className="enrollment-badge">
            <FiBookOpen size={16} />
            {activeEnrollments}/2 Active Enrollments
          </span>
        </div>
      </div>

      <div className="courses-search-section">
        <div className="courses-search-wrapper">
          <FiSearch className="courses-search-icon" />
          <input
            type="text"
            placeholder="Search courses by name, code, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="courses-search-input"
          />
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <span className="course-thumbnail-placeholder">
                    {course.shortCode || course.title.substring(0, 3)}
                  </span>
                )}
                {course.difficulty && (
                  <span className={`difficulty-badge ${getDifficultyClass(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                )}
                {course.isEnrolled && (
                  <span className={`enrolled-status-badge ${course.isCompleted ? "status-completed" : "status-enrolled"}`}>
                    {course.isCompleted ? "✓ Completed" : "● Enrolled"}
                  </span>
                )}
              </div>

              <div className="course-body">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">
                  {course.description || "No description available."}
                </p>

                <div className="course-meta">
                  <span className="course-meta-tag">
                    <FiLayers /> {course.department}
                  </span>
                  {course.durationWeeks && (
                    <span className="course-meta-tag">
                      <FiClock /> {course.durationWeeks} weeks
                    </span>
                  )}
                </div>

                <div className="course-footer">
                  <button
                    className={getButtonClass(course)}
                    disabled={
                      course.isEnrolled ||
                      course.isCompleted ||
                      !course.canEnroll ||
                      enrollingId === course.id
                    }
                    onClick={() => handleEnroll(course.id)}
                  >
                    {enrollingId === course.id ? (
                      <>
                        <span className="enroll-spinner"></span>
                        Enrolling...
                      </>
                    ) : (
                      <>
                        {course.isCompleted ? (
                          <FiCheckCircle size={16} />
                        ) : course.isEnrolled ? (
                          <FiCheckCircle size={16} />
                        ) : (
                          <FiPlus size={16} />
                        )}
                        {getButtonLabel(course)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="courses-empty-state">
            <FiBookOpen className="courses-empty-icon" />
            <p>No courses found</p>
            {searchTerm && <p>Try adjusting your search term</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableCourses;
