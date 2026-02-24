import { useEffect, useState } from "react";
import { 
  ArrowLeft, BookOpen, Users, FileText, Settings, 
  ChevronRight, Plus, Rocket, Eye
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";

interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: string;
  topics_count: number;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  student_count: number;
  lesson_count: number;
  status: string;
}

interface ManageCourseProps {
  courseId: string;
  onBack: () => void;
}

const ManageCourse = ({ courseId, onBack }: ManageCourseProps) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/teacher/courses`), // Need to find the specific one or add GET /courses/:id
          api.get(`/teacher/courses/${courseId}/lessons`)
        ]);
        
        const currentCourse = courseRes.data.find((c: any) => c.id === courseId);
        setCourse(currentCourse);
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error("fetchCourseData error:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  if (loading) return <div className="td-loading"><div className="td-spinner" /></div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="mc-container">
      <div className="mc-header">
        <button className="mc-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Courses
        </button>
        <div className="mc-header-main">
          <div>
            <h2 className="mc-title">{course.title}</h2>
            <p className="mc-subtitle">{course.description}</p>
          </div>
          <div className="mc-actions">
            <button className="td-btn td-btn-outline td-btn-sm">
              <Eye size={14} /> Preview
            </button>
            <button className="td-btn td-btn-primary td-btn-sm">
              <Rocket size={14} /> {course.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="mc-stats-grid">
        <div className="to-stat-card">
          <div className="to-stat-icon to-icon-blue"><Users size={22} /></div>
          <div className="to-stat-body">
            <p>Enrolled Students</p>
            <div className="to-stat-val">{course.student_count}</div>
          </div>
        </div>
        <div className="to-stat-card">
          <div className="to-stat-icon to-icon-green"><BookOpen size={22} /></div>
          <div className="to-stat-body">
            <p>Total Lessons</p>
            <div className="to-stat-val">{lessons.length}</div>
          </div>
        </div>
        <div className="to-stat-card">
          <div className="to-stat-icon to-icon-purple"><FileText size={22} /></div>
          <div className="to-stat-body">
            <p>Completion Rate</p>
            <div className="to-stat-val">78%</div>
          </div>
        </div>
      </div>

      <div className="td-card" style={{ marginTop: '2rem' }}>
        <div className="td-card-header">
          <span className="td-card-title">Curriculum Structure</span>
          <button className="td-btn td-btn-primary td-btn-sm">
            <Plus size={14} /> New Lesson
          </button>
        </div>
        <div className="td-card-body" style={{ padding: '1rem' }}>
          {lessons.length === 0 ? (
            <div className="td-empty">No lessons created yet</div>
          ) : (
            <div className="mc-lesson-list">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="mc-lesson-item">
                  <div className="mc-lesson-order">{lesson.order}</div>
                  <div className="mc-lesson-info">
                    <strong>{lesson.title}</strong>
                    <span>{lesson.duration} · {lesson.topics_count || 0} topics</span>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--teacher-text-muted)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
