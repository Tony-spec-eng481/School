import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '@elearning/shared';
import { axiosInstance as api } from '@elearning/shared';

// Mock data for initial dev if needed, but we'll try to fetch
interface Topic {
  id: string;  
  title: string;
  video_url: string;
  audio_intro_url: string;
  notes: string;
}

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch lesson topics
  useEffect(() => {
    // This endpoint needs to be created in backend or we fetch course and filter
    // For now, let's assume we fetch course details which has lessons and topics
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        const course = response.data;
        // Find the lesson
        const lesson = course.lessons.find((l: any) => l.id === lessonId);
        if (lesson && lesson.topics) {
             setTopics(lesson.topics);
             setCurrentTopic(lesson.topics[0]); // Default to first topic
        }
      } catch (error) {
        console.error("Failed to fetch lesson", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
        // fetchLesson(); 
        // Mocking for now as backend might effectively need specific lesson endpoint
         setLoading(false);
    }
  }, [courseId, lessonId]);


  if (loading) return <div>Loading Lesson...</div>;

  // Placeholder if no topics found
  if (!currentTopic) return (
      <div className="p-6">
          <h2 className="text-xl">Lesson Content</h2>
          <p>No topics available for this lesson yet.</p>
          <div className="mt-4 p-4 border rounded bg-yellow-50">
              <p><strong>Dev Note:</strong> Ensure backend has lessons/topics logic fully hooked up or add mock data.</p>
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{currentTopic.title}</h1>
      
      {/* Audio Intro */}
      {currentTopic.audio_intro_url && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Audio Introduction</h3>
          <audio controls src={currentTopic.audio_intro_url} className="w-full" />
        </div>
      )}

      {/* Video Player */}
      <div className="mb-8">
        <VideoPlayer url={currentTopic.video_url} />
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Lesson Notes</h2>
        <div className="prose max-w-none">
          {/* Render markdown/html safely */}
          <div dangerouslySetInnerHTML={{ __html: currentTopic.notes }} />
        </div>
      </div>
      
      {/* Topic Navigation (if multiple topics) */}
       <div className="mt-8 flex space-x-2 overflow-x-auto pb-4">
          {topics.map(topic => (
              <button 
                key={topic.id}
                onClick={() => setCurrentTopic(topic)}
                className={`py-2 px-4 rounded whitespace-nowrap ${currentTopic.id === topic.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                  {topic.title}
              </button>
          ))}
       </div>

    </div>
  );
};

export default LessonView;
