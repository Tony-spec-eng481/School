import { useEffect, useState} from "react";
import {
  BookOpen, Search
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import { CourseCard } from '@elearning/shared';
import "@elearning/shared/styles/TeacherDashboard/TeacherCourses.css";

interface Unit {
  id: string;
  title: string;
  description: string;
  short_code: string;
  program: {
    id: string;
    title: string;
    short_code: string;
  };
  semester: number;
  year: number;
}

const TeacherCourses = ({ onManage }: { onManage?: (id: string) => void }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUnits = async () => {
    try {
      const res = await api.get("/lecturer/units");
      setUnits(res.data);
    } catch {
      // Use demo data on error
      setUnits([
        { 
          id: "1", 
          title: "Crop Production", 
          description: "Fundamentals of crop production.", 
          short_code: "AGR-101",
          program: { id: "p1", title: "BSc Agriculture", short_code: "BSc-AGR" },
          semester: 1,
          year: 1
        }
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUnits(); }, []);

  const filtered = units.filter(u => 
    u.title.toLowerCase().includes(search.toLowerCase()) || 
    u.program?.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="td-loading"><div className="td-spinner" /></div>;

  return (
    <div>
      {/* Toolbar */}
      <div className="tc-toolbar">
        <div className="tc-filters">
          <div className="tc-search-wrap" style={{ width: '100%' }}>
            <Search size={16} />
            <input
              className="tc-search"
              placeholder="Search units or programs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="td-empty">
          <BookOpen size={48} />
          <p>No units found</p>
          <span>Contact admin if you believe this is an error</span>
        </div>
      ) : (
        <div className="tc-grid">
          {filtered.map(unit => (
            <div key={unit.id} className="td-card unit-card">
              <div className="td-card-header">
                <div>
                  <h3 className="td-card-title">{unit.title}</h3>
                  <p className="td-card-subtitle">{unit.short_code}</p>
                </div>
                <div className="td-badge td-badge-blue">
                  Year {unit.year} | Sem {unit.semester}
                </div>
              </div>
              <div className="td-card-body">
                <p className="unit-description">{unit.description}</p>
                <div className="unit-program-info">
                  <strong>Program:</strong> {unit.program?.title} ({unit.program?.short_code})
                </div>
              </div>
              <div className="td-card-footer">
                <button className="td-btn td-btn-primary" onClick={() => onManage?.(unit.id)}>
                  Manage Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
