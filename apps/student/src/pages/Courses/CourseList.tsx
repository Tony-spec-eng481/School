import React, { useEffect, useState } from "react";
import { Navbar } from '@elearning/shared';
import { Footer } from '@elearning/shared';
import { CourseCard } from '@elearning/shared';
import { axiosInstance as api } from '@elearning/shared';
import { Search, Filter, BookOpen, Clock, Users, Star } from "lucide-react";
import "@elearning/shared/styles/pages/CourseList.css";
import '@elearning/shared/styles/pages/Homepage.css'

const CourseList = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      (activeFilter === "all" || course.level === activeFilter) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const filters = [
    { id: "all", label: "All Courses" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  // Calculate stats
  const totalCourses = courses.length;
  const totalStudents = courses.reduce(
    (acc, course) => acc + (course.enrolledStudents || 0),
    0,
  );
  const avgRating = (
    courses.reduce((acc, course) => acc + (course.rating || 0), 0) /
    totalCourses
  ).toFixed(1);

  return (
    <div className="course-list-page">
      <Navbar />

      <section className="course-hero">
        <div className="course-container">
          <div className="course-header">
            <span className="course-badge">
              <BookOpen
                size={14}
                style={{ marginRight: "6px", display: "inline" }}
              />
              EXPLORE KNOWLEDGE
            </span>
            <h1>
              Courses We <span>Offer</span>
            </h1>
            <p>
              Discover our wide range of courses designed to help you master new
              skills and advance your academic journey.
            </p>
          </div>

          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-value">{totalCourses}+</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalStudents}+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{avgRating}</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>

          <div className="search-section">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-section">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <Filter size={16} />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading available courses...</p>
            </div>
          ) : (
            <>
              {filteredCourses.length > 0 ? (
                <div className="course-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <BookOpen className="empty-icon" size={64} />
                  <h3>No courses found</h3>
                  <p>Try adjusting your search terms or check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseList;
