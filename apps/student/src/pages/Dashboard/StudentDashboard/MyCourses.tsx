import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '@elearning/shared';
import { FiSearch, FiBookOpen } from 'react-icons/fi';

const MyCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await studentApi.getEnrolledCourses();
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === 'active') return course.progress < 100;
    if (filter === 'completed') return course.progress === 100;
    return true;
  });

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search your courses..." 
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setFilter('active')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', background: filter === 'active' ? 'var(--student-primary)' : 'white', color: filter === 'active' ? 'white' : 'inherit', cursor: 'pointer' }}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', background: filter === 'completed' ? 'var(--student-primary)' : 'white', color: filter === 'completed' ? 'white' : 'inherit', cursor: 'pointer' }}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <img 
                src={course.thumbnail || 'https://via.placeholder.com/300x160?text=Course+Thumbnail'} 
                alt={course.title} 
                className="course-thumbnail"
              />
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--student-text-muted)', marginBottom: '1rem' }}>
                  By {course.teacher || 'Instructor'} • {course.lessonCount} Lessons
                </p>
                
                <div className="course-progress-container">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="progress-text">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                </div>

                <div className="course-footer">
                   <span style={{ fontSize: '0.75rem', color: 'var(--student-text-muted)' }}>
                     Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : 'Never'}
                   </span>
                   <button 
                     onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                     className="btn-continue"
                   >
                     {course.progress === 100 ? 'Review' : 'Continue'}
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem', border: '1px dotted var(--student-border)' }}>
            <FiBookOpen size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <p style={{ color: '#64748b' }}>No courses found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
