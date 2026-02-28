import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Clock,
  Award,
  PlayCircle,
  FileText,
  CheckCircle,
  Star,
  Calendar,
  User,
  BarChart,
  MessageCircle,
  Download,
  Share2,
  Bookmark,
  ChevronRight,
  Play,
  File,
  Video,
  FileQuestion,
  FileCheck,
  Globe,
  Languages,
  TrendingUp,
  Target,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import "./CourseDetails.css";

// Dummy data for demonstration
const dummyCourse = {
  id: "1",
  title: "Advanced Web Development Masterclass 2024",
  description:
    "Master modern web development with React, TypeScript, and Node.js. Build real-world applications and learn industry best practices.",
  longDescription: `This comprehensive course takes you from intermediate to advanced level in web development. You'll learn how to build scalable, production-ready applications using the latest technologies and best practices.

Throughout this course, you'll work on real-world projects that simulate actual development scenarios. You'll learn not just the syntax, but the reasoning behind architectural decisions, performance optimization techniques, and how to write clean, maintainable code.

The curriculum is designed by industry experts with years of experience at top tech companies. You'll gain insights into how professional teams build and deploy applications at scale.`,
  thumbnail: "/api/placeholder/1200/600",
  category: "Web Development",
  language: "English",
  subtitleAvailable: true,
  duration: "32 hours",
  lessons: 48,
  lastUpdated: "January 2024",
  learningObjectives: [
    "Build scalable web applications with React and TypeScript",
    "Implement state management using Redux Toolkit and Context API",
    "Create RESTful APIs with Node.js and Express",
    "Design and optimize databases with PostgreSQL and MongoDB",
    "Deploy applications to cloud platforms (AWS, Vercel, Netlify)",
    "Implement authentication and authorization systems",
    "Write unit and integration tests with Jest and React Testing Library",
    "Optimize application performance and loading times",
    "Use modern development tools and workflows (Git, Webpack, ESLint)",
    "Follow industry best practices and design patterns",
  ],
  prerequisites: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "Familiarity with React fundamentals",
    "Understanding of basic programming concepts",
    "A computer with internet connection",
  ],
  curriculum: [
    {
      section: "Getting Started",
      lessons: [
        {
          title: "Course Introduction",
          duration: "5:30",
          type: "video",
          preview: true,
        },
        {
          title: "Development Environment Setup",
          duration: "15:45",
          type: "video",
        },
        {
          title: "Course Resources and Materials",
          duration: "8:20",
          type: "article",
        },
      ],
    },
    {
      section: "React Fundamentals Deep Dive",
      lessons: [
        {
          title: "Advanced Component Patterns",
          duration: "45:20",
          type: "video",
        },
        { title: "Hooks in Depth", duration: "52:15", type: "video" },
        { title: "Performance Optimization", duration: "38:40", type: "video" },
        {
          title: "Code Challenge: Build a Custom Hook",
          duration: "20:00",
          type: "quiz",
        },
      ],
    },
    {
      section: "State Management with Redux Toolkit",
      lessons: [
        {
          title: "Redux Architecture Overview",
          duration: "25:30",
          type: "video",
        },
        { title: "Setting Up Redux Toolkit", duration: "32:45", type: "video" },
        {
          title: "Async Operations with Redux Thunk",
          duration: "41:20",
          type: "video",
        },
        {
          title: "Practice Exercise: Shopping Cart",
          duration: "30:00",
          type: "exercise",
        },
      ],
    },
    {
      section: "Backend Development with Node.js",
      lessons: [
        {
          title: "RESTful API Design Principles",
          duration: "35:10",
          type: "video",
        },
        {
          title: "Building Express Middleware",
          duration: "28:45",
          type: "video",
        },
        { title: "Database Integration", duration: "42:30", type: "video" },
        { title: "API Testing with Postman", duration: "22:15", type: "video" },
      ],
    },
  ],
  features: [
    "Certificate of completion",
    "Downloadable resources and code",
    "Community discussion forum",
    "Direct instructor support",
    "Regular content updates",
    "Project-based learning",
    "Job interview preparation guide",
  ],
  requirements: [
    "Modern web browser",
    "Code editor (VS Code recommended)",
    "Basic command line knowledge",
    "Git installed on your computer",
  ],
  targetAudience: [
    "Intermediate developers wanting to advance their skills",
    "Frontend developers looking to become full-stack",
    "Computer science students",
    "Self-taught programmers seeking structured learning",
    "Developers preparing for technical interviews",
  ],
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState(dummyCourse);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    console.log("Fetching course details for ID:", id);
    // In real implementation, fetch from API
    // fetchCourseDetails(id).then(data => setCourse(data));
  }, [id]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName],
    );
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={16} />;
      case "article":
        return <FileText size={16} />;
      case "quiz":
        return <FileQuestion size={16} />;
      case "exercise":
        return <FileCheck size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    // In real implementation, call enrollment API
    navigate(`/auth/login`);
    console.log("Enrolling in course:", id);
  };

  const totalDuration = course.curriculum.reduce((total, section) => {
    return (
      total +
      section.lessons.reduce((secTotal, lesson) => {
        const minutes = parseInt(lesson.duration.split(":")[0]) || 0;
        return secTotal + minutes;
      }, 0)
    );
  }, 0);

  return (
    <div className="course-details-container">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="breadcrumb">
              <Link to="/courses">Courses</Link>
              <ChevronRight size={14} />
              <span>{course.category}</span>
              <ChevronRight size={14} />
              <span className="current">{course.title}</span>
            </div>

            <h1 className="course-title">{course.title}</h1>
            <p className="course-description">{course.description}</p>

            <div className="course-meta">
              {/* <div className="meta-item">
                <Award size={18} />
                <span>{course.level}</span>
              </div> */}
              <div className="meta-item">
                <Clock size={18} />
                <span>{course.duration}</span>
              </div>
              <div className="meta-item">
                <BookOpen size={18} />
                <span>{course.lessons} lessons</span>
              </div>
            </div>

            <div className="hero-actions">
              <button
                className={`btn ${isEnrolled ? "enrolled" : "primary"}`}
                onClick={handleEnroll}
                disabled={isEnrolled}
              >
                {isEnrolled ? "Enrolled" : "Enroll Now"}
              </button>
              <button
                className={`btn btn-outline ${isBookmarked ? "active" : ""}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  size={18}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                {isBookmarked ? "Saved" : "Save for Later"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="course-main">
        <div className="content-wrapper">
          {/* Tabs Navigation */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
              onClick={() => setActiveTab("curriculum")}
            >
              Curriculum
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="overview-tab">
                {/* Long Description */}
                <section className="content-section">
                  <h2>About This Course</h2>
                  <div className="description-text">
                    {course.longDescription
                      .split("\n\n")
                      .map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                  </div>
                </section>

                {/* What You'll Learn */}
                <section className="content-section">
                  <h2>What You'll Learn</h2>
                  <div className="objectives-grid">
                    {course.learningObjectives.map((objective, idx) => (
                      <div key={idx} className="objective-item">
                        <CheckCircle size={20} className="check-icon" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Course Features */}
                <section className="content-section">
                  <h2>Course Features</h2>
                  <div className="features-grid">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <Zap size={18} className="feature-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Prerequisites */}
                <section className="content-section">
                  <h2>Prerequisites</h2>
                  <ul className="prerequisites-list">
                    {course.prerequisites.map((prereq, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} className="check-icon" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Target Audience */}
                <section className="content-section">
                  <h2>Who This Course Is For</h2>
                  <ul className="audience-list">
                    {course.targetAudience.map((audience, idx) => (
                      <li key={idx}>
                        <Target size={16} className="target-icon" />
                        {audience}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="curriculum-tab">
                <div className="curriculum-header">
                  <div className="curriculum-stats">
                    <span>
                      {course.lessons} lessons • {totalDuration} minutes total
                    </span>
                  </div>
                </div>

                <div className="curriculum-sections">
                  {course.curriculum.map((section, idx) => (
                    <div key={idx} className="curriculum-section">
                      <div
                        className="section-header"
                        onClick={() => toggleSection(section.section)}
                      >
                        <div className="section-title">
                          <ChevronRight
                            size={18}
                            className={`chevron ${expandedSections.includes(section.section) ? "expanded" : ""}`}
                          />
                          <h3>{section.section}</h3>
                        </div>
                        <span className="section-stats">
                          {section.lessons.length} lessons •
                          {section.lessons.reduce((total, lesson) => {
                            const mins =
                              parseInt(lesson.duration.split(":")[0]) || 0;
                            return total + mins;
                          }, 0)}{" "}
                          min
                        </span>
                      </div>

                      {expandedSections.includes(section.section) && (
                        <div className="lessons-list">
                          {section.lessons.map((lesson, lessonIdx) => (
                            <div key={lessonIdx} className="lesson-item">
                              <div className="lesson-info">
                                <span className="lesson-icon">
                                  {getLessonIcon(lesson.type)}
                                </span>
                                <span className="lesson-title">
                                  {lesson.title}
                                </span>
                                {lesson.preview && (
                                  <span className="preview-badge">Preview</span>
                                )}
                              </div>
                              <span className="lesson-duration">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar */}
        <div className="course-sidebar">
          <div className="sidebar-widget">
            <h3>This Course Includes</h3>
            <ul className="includes-list">
              <li>
                <Clock size={18} />
                <span>{course.duration} on-demand video</span>
              </li>
              <li>
                <Globe size={18} />
                <span>Full lifetime access</span>
              </li>
          
              <li>
                <Award size={18} />
                <span>Certificate of completion</span>
              </li>
              <li>
                <MessageCircle size={18} />
                <span>Discussion forum access</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3>Related Courses</h3>
            <div className="related-courses">
              {[1, 2, 3].map((item) => (
                <Link
                  to={`/courses/${item}`}
                  key={item}
                  className="related-course"
                >
                  <img src="/api/placeholder/80/60" alt="Related course" />
                  <div>
                    <h4>React Native Masterclass</h4>
                    <span>24 lessons • 4.7 ★</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Share This Course</h3>
            <div className="share-options">
              <button className="share-option">Twitter</button>
              <button className="share-option">Facebook</button>
              <button className="share-option">LinkedIn</button>
              <button className="share-option">Copy Link</button>
            </div>
            <button
              className="modal-close"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
