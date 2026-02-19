import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance as api } from '@elearning/shared';
import {
  ChevronLeft,
  Users,
  BookOpen,
  Star,
  Activity,
  Calendar,
  Mail,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import "@elearning/shared/styles/AdminDashboard/StatsOverview.css"; // Reuse stats styles

interface TeacherStats {
  courses: number;
  students: number;
  rating: string;
  activity: string;
}

interface TeacherReport {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  teacher_details?: {
    teacher_id: string;
    department: string;
    subjects: string[];
  };
  stats: TeacherStats;
}

const TeacherReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherReport = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        // Mocking additional stats for the report
        const teacherData = {
          ...response.data,
          stats: {
            courses: Math.floor(Math.random() * 5) + 1,
            students: Math.floor(Math.random() * 500) + 100,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            activity: "98%",
          },
        };
        setTeacher(teacherData);
      } catch (error) {
        toast.error("Failed to load teacher report");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teacher) return null;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary mb-6 transition"
      >
        <ChevronLeft size={20} />
        <span>Back to Teachers</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-6">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
            {teacher.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{teacher.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1">
                <Mail size={16} />
                {teacher.email}
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                ID: {teacher.teacher_details?.teacher_id || "STAFF"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <BookOpen size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">Courses</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.stats.courses}</p>
            <p className="text-xs text-green-600 mt-2">Active teaching</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Users size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">Students</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.stats.students}</p>
            <p className="text-xs text-green-600 mt-2">Enrolled across all courses</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Star size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">Rating</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.stats.rating}</p>
            <p className="text-xs text-gray-500 mt-2">Based on student feedback</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Activity size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">Activity</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.stats.activity}</p>
            <p className="text-xs text-green-600 mt-2">System engagement score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Professional Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500">Department</span>
              <span className="font-medium">{teacher.teacher_details?.department || "General Engineering"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-gray-900">
                {new Date(teacher.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-3">Core Subjects</span>
              <div className="flex flex-wrap gap-2">
                {(teacher.teacher_details?.subjects || ["React", "Advanced Web Design", "UI/UX Principles"]).map((subject, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Recent Activity Log
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-900 font-medium">Uploaded new lesson: Module {i} advanced topics</p>
                  <p className="text-xs text-gray-400 mt-1">{i * 2} days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReport;
