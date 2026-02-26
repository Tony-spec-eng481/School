import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@elearning/shared';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Unit {
  id: string; // lecturer_unit id
  unit_id: string;
  title: string;
  short_code: string;
}

interface LiveClass {
  id: string;
  title: string;
  unit_id: string;
  start_time: string;
  end_time: string;
  live_url: string;
  status: string;
}

const LiveClasses = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    unit_id: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, overviewRes] = await Promise.all([
          axiosInstance.get('/lecturer/units'),
          axiosInstance.get('/lecturer/overview') // Using overview to get upcoming classes as fallback
        ]);
        setUnits(unitsRes.data);
        if (unitsRes.data.length > 0) {
          setFormData(prev => ({ ...prev, unit_id: unitsRes.data[0].id }));
        }
        
        // Either fetch from a dedicated endpoint or from overview
        try {
          const classesRes = await axiosInstance.get('/lecturer/live-classes');
          setClasses(classesRes.data);
        } catch (e) {
          // Fallback to overview upcoming classes
          setClasses(overviewRes.data.upcomingClasses || []);
        }
      } catch (err: any) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = units.find(u => u.id === e.target.value);
    if (unit) {
      setFormData({ ...formData, unit_id: unit.id });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // The user's controller shows an endpoint that accepts courseId or unit_id.
      // The lecturer controller uses unit_id, while the other snippet uses courseId.
      // We'll pass both to be safe depending on which unified API is used.
      const payload = {
        title: formData.title,
        unit_id: formData.unit_id,
        // courseId: formData.unit_id,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      if (!formData.unit_id) {
        toast.error("Please select a unit");
        return;
      }
      await axiosInstance.post("/live-classes", payload);
      toast.success("Live class scheduled successfully!");

      // Refresh
      const classesRes = await axiosInstance.get("/lecturer/live-classes");
      setClasses(classesRes.data);

      setFormData((prev) => ({
        ...prev,
        title: "",
        start_time: "",
        end_time: "",
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to schedule class");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Live Classes</h1>
        <p className="page-subtitle">
          Schedule and manage interaction sessions with students.
        </p>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div className="card">
          <h3 className="mb-4">Schedule New Class</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select unit</option>

                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title} ({unit.short_code})
                  </option>
                ))}
              </select>
            </div>

            <div
              className="form-group"
              style={{ display: "flex", gap: "16px" }}
            >
              <div style={{ flex: 1 }}>
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  className="form-control"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  className="form-control"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary mt-4"
              disabled={submitting}
            >
              {submitting ? "Scheduling…" : "Schedule Class"}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-4">Upcoming Classes</h3>
          {classes.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {classes.map((cls, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <h4 style={{ fontWeight: 600, color: "var(--blue-800)" }}>
                      {cls.title}
                    </h4>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 8px",
                        background: "var(--blue-100)",
                        color: "var(--blue-600)",
                        borderRadius: "4px",
                      }}
                    >
                      {cls.status || "Scheduled"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      marginBottom: "12px",
                    }}
                  >
                    {new Date(cls.start_time).toLocaleString()} -{" "}
                    {new Date(cls.end_time).toLocaleTimeString()}
                  </div>
                  {cls.live_url && (
                    <Link
                      to={`/dashboard/live-classes/room/${cls.live_url}`}
                      target="_blank" // Opens in a new tab/window
                      rel="noopener noreferrer" // Security best practice
                      className="btn-primary"
                      style={{
                        display: "inline-block",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                      }}
                    >
                      Join Class Link
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming classes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
