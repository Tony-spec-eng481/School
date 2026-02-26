import React, { useEffect, useState } from "react";
import { axiosInstance } from "@elearning/shared";
import toast from "react-hot-toast";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import "../styles/Assignments.css"; // Import the CSS file


interface Unit {
  id: string; // lecturer_unit id
  unit_id: string;
  title: string;
  short_code: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file_url?: string;
  created_at: string;
  units?: { title: string; short_code: string };
}

interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  submitted_at: string;
  grade?: string;
  users?: { name: string; email: string };
  assignments?: { title: string; unit_id: string };
}

const Assignments = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    unit_id: string;
    description: string;
    due_date: string;
    file_url: string | File;
  }>({
    title: "",
    unit_id: "",
    description: "",
    due_date: "",
    file_url: "", // For attaching PDFs
  });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'color', 'background', 'clean', 'align', 'script'
];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, assignRes, subRes] = await Promise.all([
          axiosInstance.get("/lecturer/units"),
          axiosInstance.get("/lecturer/assignments"),
          axiosInstance.get("/lecturer/submissions"),
        ]);

        setUnits(unitsRes.data);
        if (unitsRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            unit_id: unitsRes.data[0].unit_id,
          }));
        }

        setAssignments(assignRes.data);
        setSubmissions(subRes.data);
      } catch (err: any) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    if (type === 'file') {

      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleQuillChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = units.find((u) => u.id === e.target.value);
    if (unit) {
      setFormData({ ...formData, unit_id: unit.unit_id });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unit_id) return toast.error("Please select a unit");

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('unit_id', formData.unit_id);
      data.append('description', formData.description);
      data.append('due_date', formData.due_date);
      
      if (formData.file_url instanceof File) {
        data.append('file', formData.file_url);
      } else {
        data.append('file_url', formData.file_url);
      }

      await axiosInstance.post("/lecturer/assignments", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Assignment created successfully!");

      const assignRes = await axiosInstance.get("/lecturer/assignments");
      setAssignments(assignRes.data);

      setFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        due_date: "",
        file_url: "",
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create assignment");
    }

  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span className="loading-text">Loading assignments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-container">
      <div className="page-header">
        <h1 className="page-title">Assignments & Cats</h1>
        <p className="page-subtitle">
          Create assignments, track due dates, and view student submissions.
        </p>
      </div>

      <div className="grid-container">
        {/* Create Assignment Form */}
        <div className="card">
          <h3>Create Assignment</h3>
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
                placeholder="Enter assignment title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select
                className="form-control"
                onChange={handleUnitChange}
                value={
                  units.find((u) => u.unit_id === formData.unit_id)?.id || ""
                }
              >
                <option value="">Select a unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title} ({unit.short_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Questions</label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleQuillChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Type questions or instructions here..."
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="datetime-local"
                  name="due_date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Assignment File</label>
                <input
                  type="file"
                  name="file_url"
                  className="form-control"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </div>
            </div>


            <button type="submit" className="btn-primary mt-4">
              Create Assignment
            </button>
          </form>
        </div>

        {/* Assignments and Submissions Lists */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className="card">
            <h3>Recent Assignments</h3>
            {assignments.length > 0 ? (
              <div className="assignments-list">
                {assignments.map((assign) => (
                  <div key={assign.id} className="assignment-item">
                    <div className="assignment-header">
                      <span className="assignment-title">{assign.title}</span>
                      <span className="assignment-due">
                        Due: {new Date(assign.due_date).toLocaleString()}
                      </span>
                    </div>
                    <div className="assignment-unit">
                      {assign.units?.short_code}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No assignments created yet.</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Recent Submissions</h3>
            {submissions.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Submitted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((sub) => (
                      <tr key={sub.id}>
                        <td className="font-medium text-gray-900">
                          {sub.users?.name || "Unknown"}
                        </td>
                        <td>
                          {sub.assignments?.title || "Unknown Assignment"}
                        </td>
                        <td className="text-gray-500">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No submissions yet.</p>
              </div>
            )}
            {submissions.length > 5 && (
              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <button className="btn-primary btn-outline">
                  View All Submissions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
