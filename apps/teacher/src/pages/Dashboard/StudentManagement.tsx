// StudentManagement.tsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@elearning/shared";
import "../styles/StudentManagement.css"; // Import the CSS file

interface Unit {
  id: string;
  unit_id: string;
  program_id: string;
  program: { id: string; title: string; short_code: string };
  title: string;
  short_code: string;
  description: string;
  semester: number;
  year: number;
}

interface Course {
  id: string;
  title: string;
  short_code: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

const StudentManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get("/lecturer/units");
        const units: Unit[] = response.data;

        const courseMap = new Map<string, Course>();
        units.forEach((unit) => {
          if (unit.program && !courseMap.has(unit.program_id)) {
            courseMap.set(unit.program_id, {
              id: unit.program_id,
              title: unit.program.title,
              short_code: unit.program.short_code,
            });
          }
        });

        const uniqueCourses = Array.from(courseMap.values());
        setCourses(uniqueCourses);

        if (uniqueCourses.length > 0) {
          setSelectedCourseId(uniqueCourses[0].id);
        }
      } catch (err: any) {
        console.error("Failed to fetch units/courses:", err);
        setError(err.response?.data?.error || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/lecturer/courses/${selectedCourseId}/students`,
        );
        setStudents(response.data);
      } catch (err: any) {
        console.error("Failed to fetch students:", err);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourseId]);

  if (loading) {
    return (
      <div className="student-management">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="student-management">
      <div className="page-header">
        <h1>Student Management</h1>
        <p>View students enrolled in the courses you teach.</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Select Course</h3>
        </div>
        <div className="card-body">
          <div className="course-selector">
            <label htmlFor="course-select">Course</label>
            <select
              id="course-select"
              className="course-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.short_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>
            Enrolled Students
            <span className="student-count">{students.length}</span>
          </h3>
        </div>

        <div className="card-body">
          {studentsLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading students...</span>
            </div>
          ) : students.length > 0 ? (
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">{student.name}</div>
                      </td>
                      <td>
                        <div className="student-email">{student.email}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3>No students found</h3>
              <p>No students are currently enrolled in this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
