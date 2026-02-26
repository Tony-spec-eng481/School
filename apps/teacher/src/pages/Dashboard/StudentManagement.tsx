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

interface Student {
  users: {
    id: string;
    name: string;
    email: string;
  };
}

const StudentManagement = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get('/lecturer/units');
        setUnits(response.data);
        if (response.data.length > 0) {
          setSelectedUnitId(response.data[0].id); // The 'id' of the unit object
        }
      } catch (err: any) {
        console.error('Failed to fetch units:', err);
        setError(err.response?.data?.error || 'Failed to load units');
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    if (!selectedUnitId) return;

    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        const response = await axiosInstance.get(`/lecturer/units/${selectedUnitId}/students`);
        setStudents(response.data);
      } catch (err: any) {
        console.error('Failed to fetch students:', err);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedUnitId]);

  if (loading) return <div>Loading units...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <p className="page-subtitle">View students enrolled in your units.</p>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="card mb-4">
        <div className="form-group mb-0">
          <label className="form-label">Select Unit</label>
          <select 
            className="form-control" 
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.title} ({unit.short_code}) - {unit.program?.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Enrolled Students ({students.length})</h3>
        {studentsLoading ? (
          <div>Loading students...</div>
        ) : students.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.users?.id || idx}>
                    <td className="font-medium text-gray-900">{student.users?.name || 'Unknown'}</td>
                    <td className="text-gray-500">{student.users?.email || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No students found for this unit.</p>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
