// MyUnits.tsx — Course-first view
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "@elearning/shared";
import { FiSearch, FiBookOpen, FiGrid, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import "../styles/MyUnits.css";

interface Unit {
  id: string;
  title: string;
  description: string;
  semester: number;
  year: number;
  topicCount: number;
  liveClassCount: number;
}

interface EnrolledCourse {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseThumbnail: string | null;
  courseDifficulty: string;
  courseShortCode: string;
  progress: number;
  completed: boolean;
  units: Unit[];
}

const MyUnits = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await studentApi.getUnits();
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled units:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your courses...</p>
      </div>
    );
  }

  // ─── Units view (when a course is selected) ───
  if (selectedCourse) {
    const filteredUnits = selectedCourse.units.filter((unit) =>
      unit.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="my-units-container animate-fade-in">
        <div className="units-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => { setSelectedCourse(null); setSearchTerm(""); }}
              className="btn-unit-details"
              style={{ padding: "0.5rem 1rem" }}
            >
              <FiArrowLeft size={16} /> Back
            </button>
            <h1 className="header-title">{selectedCourse.courseTitle}</h1>
          </div>
          <div className="header-stats">
            <span className="stat-chip">
              <FiGrid size={16} />
              {selectedCourse.units.length} {selectedCourse.units.length === 1 ? "Unit" : "Units"}
            </span>
            <span className="stat-chip">
              {selectedCourse.progress}% Progress
            </span>
          </div>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search units by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="units-grid">
          {filteredUnits.length > 0 ? (
            filteredUnits.map((unit) => (
              <div key={unit.id} className="unit-card">
                <div className="unit-header">
                  <h3>{unit.title}</h3>
                </div>
                <div className="unit-content">
                  <p className="unit-description">
                    {unit.description || "No description available for this unit."}
                  </p>

                  <div className="unit-stats">
                    <div className="stat-block">
                      <p className="stat-number">{unit.topicCount || 0}</p>
                      <p className="stat-label">Topics</p>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-block">
                      <p className="stat-number">{unit.liveClassCount || 0}</p>
                      <p className="stat-label">Live Classes</p>
                    </div>
                  </div>

                  <div className="unit-footer">
                    <span className="unit-program">
                      {selectedCourse.courseShortCode || "Course"}
                    </span>
                    <button
                      onClick={() => navigate(`/dashboard/units/${unit.id}`)}
                      className="btn-unit-details"
                    >
                      Unit Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FiBookOpen className="empty-icon" />
              <p>No units found</p>
              {searchTerm && (
                <p className="empty-subtext">Try adjusting your search term</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Course cards view (default) ───
  const filteredCourses = enrolledCourses.filter((c) =>
    c.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-units-container animate-fade-in">
      <div className="units-header">
        <h1 className="header-title">My Units</h1>
        <div className="header-stats">
          <span className="stat-chip">
            <FiGrid size={16} />
            {enrolledCourses.length} {enrolledCourses.length === 1 ? "Course" : "Courses"} Enrolled
          </span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="units-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.courseId}
              className="unit-card"
              style={{ cursor: "pointer" }}
              onClick={() => { setSelectedCourse(course); setSearchTerm(""); }}
            >
              <div className="unit-header">
                <h3>{course.courseTitle}</h3>
              </div>
              <div className="unit-content">
                <p className="unit-description">
                  {course.courseDescription || "No description available."}
                </p>

                <div className="unit-stats">
                  <div className="stat-block">
                    <p className="stat-number">{course.units.length}</p>
                    <p className="stat-label">Units</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-block">
                    <p className="stat-number">{course.progress}%</p>
                    <p className="stat-label">Progress</p>
                  </div>
                </div>

                <div className="unit-footer">
                  <span className="unit-program">
                    {course.courseShortCode || course.courseDifficulty || "Course"}
                  </span>
                  <button
                    className="btn-unit-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                      setSearchTerm("");
                    }}
                  >
                    View Units <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FiBookOpen className="empty-icon" />
            <p>
              {enrolledCourses.length === 0
                ? "No courses enrolled yet"
                : "No courses found"}
            </p>
            {enrolledCourses.length === 0 && (
              <p className="empty-subtext">
                Visit the Courses section to browse and enroll in courses
              </p>
            )}
            {searchTerm && (
              <p className="empty-subtext">Try adjusting your search term</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUnits;
