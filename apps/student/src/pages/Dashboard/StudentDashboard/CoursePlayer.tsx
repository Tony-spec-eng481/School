import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '@elearning/shared';
import { FiChevronLeft, FiPlayCircle, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';

const CoursePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      try {
        const res = await studentApi.getCoursePlayerDetails(id);
        setCourse(res.data);
        // Default to first topic of first lesson if available
        if (res.data.lessons?.length > 0 && res.data.lessons[0].topics?.length > 0) {
          setCurrentTopic(res.data.lessons[0].topics[0]);
        }
      } catch (err) {
        console.error('Error fetching course player details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!currentTopic || !id) return;
    try {
      await studentApi.markTopicComplete({ topicId: currentTopic.id, courseId: id });
      // Update local state
      setCourse( (prev: any) => ({
        ...prev,
        lessons: prev.lessons.map( (l: any) => ({
          ...l,
          topics: l.topics.map( (t: any) => t.id === currentTopic.id ? { ...t, isCompleted: true } : t)
        }))
      }));
    } catch (err) {
      console.error('Error marking topic complete:', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading learning area...</div>;
  if (!course) return <div style={{ padding: '2rem' }}>Course not found.</div>;

  return (
    <div className="course-player-container animate-fade-in">
      {/* Sidebar: Lessons List */}
      <aside className="player-sidebar">
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--student-border)' }}>
          <button 
            onClick={() => navigate('/dashboard/courses')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--student-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <FiChevronLeft /> Back to Dashboard
          </button>
          <h2 style={{ fontSize: '1.125rem', marginTop: '1rem', fontWeight: 700 }}>{course.title}</h2>
        </div>

        <div className="lesson-list">
          {course.lessons.map( (lesson: any, lIdx: any) => (
            <div key={lesson.id} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>
                {lIdx + 1}. {lesson.title}
              </h4>
              <div>
                {lesson.topics.map( (topic: any) => (
                  <div 
                    key={topic.id} 
                    className={`lesson-item ${currentTopic?.id === topic.id ? 'active' : ''}`}
                    onClick={() => setCurrentTopic(topic)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {topic.content_type === 'video' ? <FiPlayCircle size={16} color="#64748b" /> : <FiFileText size={16} color="#64748b" />}
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{topic.title}</span>
                      </div>
                      {topic.isCompleted && <FiCheckCircle size={14} color="var(--student-success)" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Area: Content Player */}
      <main className="player-content">
        {currentTopic ? (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{currentTopic.title}</h1>
            
            {currentTopic.video_url && (
              <div className="video-container">
                <video 
                  src={currentTopic.video_url} 
                  controls 
                  style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
                />
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Lesson Notes</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   {currentTopic.audio_intro_url && (
                     <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--student-border)', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                        Audio Class
                     </button>
                   )}
                   <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--student-border)', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <FiDownload /> Materials
                   </button>
                </div>
              </div>
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: currentTopic.notes || 'No notes available for this topic.' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button 
                 onClick={handleMarkComplete}
                 disabled={currentTopic.isCompleted}
                 style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '0.75rem', 
                   padding: '0.75rem 1.5rem', 
                   background: currentTopic.isCompleted ? '#f1f5f9' : 'var(--student-primary)', 
                   color: currentTopic.isCompleted ? '#94a3b8' : 'white', 
                   border: 'none', 
                   borderRadius: '0.5rem', 
                   fontWeight: 600, 
                   cursor: currentTopic.isCompleted ? 'default' : 'pointer' 
                 }}
               >
                 <FiCheckCircle /> {currentTopic.isCompleted ? 'Completed' : 'Mark Topic as Complete'}
               </button>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <FiPlayCircle size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>Select a topic to start learning</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursePlayer;
