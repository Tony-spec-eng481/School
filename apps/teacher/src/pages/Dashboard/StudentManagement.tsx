import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@elearning/shared';

interface Unit {
  id: string; // lecturer_units id
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get('/lecturer/units');
        const units: Unit[] = response.data;
        
        // Extract unique courses from units
        const courseMap = new Map<string, Course>();
        units.forEach(unit => {
          if (unit.program && !courseMap.has(unit.program_id)) {
            courseMap.set(unit.program_id, {
              id: unit.program_id,
              title: unit.program.title,
              short_code: unit.program.short_code
            });
          }
        });
        
        const uniqueCourses = Array.from(courseMap.values());
        setCourses(uniqueCourses);
        
        if (uniqueCourses.length > 0) {
          setSelectedCourseId(uniqueCourses[0].id);
        }
      } catch (err: any) {
        console.error('Failed to fetch units/courses:', err);
        setError(err.response?.data?.error || 'Failed to load courses');
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
        const response = await axiosInstance.get(`/lecturer/courses/${selectedCourseId}/students`);
        setStudents(response.data);
      } catch (err: any) {
        console.error('Failed to fetch students:', err);
      } finally {
        setStudentsLoading(false);
      }   
    };

    fetchStudents();
  }, [selectedCourseId]);

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-3">Loading courses...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-500">View students enrolled in the courses you teach.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md" 
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

      <div className="card bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Enrolled Students <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{students.length}</span>
          </h3>
        </div>
        
        <div className="p-6">
          {studentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-500">Loading students...</span>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">No students are currently enrolled in this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
