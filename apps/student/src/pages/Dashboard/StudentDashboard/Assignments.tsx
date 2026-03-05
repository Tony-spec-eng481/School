// Assignments.tsx
import React, { useState, useEffect } from "react";
import { studentApi } from "@elearning/shared";
import {
  FiFileText,
  FiCalendar,
  FiClock,
  FiUpload,
  FiCheckCircle,
  FiArrowLeft,
  FiDownload,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import "../styles/Assignments.css"; // Import the CSS file

const Assignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await studentApi.getAssignments();
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === "active") return !a.submission;
    if (activeTab === "completed") return !!a.submission;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (answerText) formData.append("answer_text", answerText);

      await studentApi.submitAssignment(selectedAssignment.id, formData);
      toast.success("Assignment submitted successfully");

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                submission: {
                  status: "submitted",
                  submitted_at: new Date().toISOString(),
                  file_url: file ? file.name : "",
                },
              }
            : a,
        ),
      );

      setSelectedAssignment(null);
      setFile(null);
      setAnswerText("");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="assignments-container animate-fade-in">
      <div className="assignments-header">
        <h1 className="header-title">Assignments & Quizzes</h1>
        <p className="header-subtitle">
          Complete your tasks to track your understanding and earn grades.
        </p>
      </div>

      <div className="assignments-card">
        <div className="tab-bar">
          <button
            onClick={() => {
              setActiveTab("active");
              setSelectedAssignment(null);
            }}
            className={`tab-button ${activeTab === "active" ? "active" : "inactive"}`}
          >
            Active
          </button>
          <button
            onClick={() => {
              setActiveTab("completed");
              setSelectedAssignment(null);
            }}
            className={`tab-button ${activeTab === "completed" ? "active" : "inactive"}`}
          >
            Completed
          </button>
        </div>

        <div className="content-area">
          {selectedAssignment ? (   
            <div className="assignment-detail">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="back-button"
              >
                <FiArrowLeft size={16} /> Back to list
              </button>

              <h3 className="assignment-title">{selectedAssignment.title}</h3>
              
              <div className="assignment-meta-detail">
                <span className="meta-item">
                  <FiCalendar /> Uploaded: {new Date(selectedAssignment.created_at).toLocaleString()}
                </span>
                <span className="meta-item">
                  <FiClock /> Deadline: {new Date(selectedAssignment.due_date).toLocaleString()}
                </span>
              </div>

              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}  rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {selectedAssignment.description}
                </ReactMarkdown>
              </div>     

              {selectedAssignment.file_url && (
                <div className="assignment-attachment">
                  <a 
                    href={selectedAssignment.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    <FiDownload /> Download Assignment Document
                  </a>
                </div>
              )}


              <div className="submission-form">
                <h4 className="form-title">Submit Your Work</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Upload PDF Document</label>
                    <div className="input-wrapper">
                      <FiUpload />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="form-input"
                        id="document-upload"
                      />
                    </div>
                    <p className="input-hint">
                      * Please upload your assignment as a PDF file.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Answer Text / Comments</label>
                    <textarea
                      rows={4}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="form-textarea"
                      placeholder="Type your answer or any comments here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (!file && !answerText)}
                    className="submit-button"
                  >
                    {submitting ? "Submitting..." : "Submit Assignment"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {filteredAssignments.length > 0 ? (
                <div className="assignments-list">
                  {filteredAssignments.map((a) => (
                    <div key={a.id} className="assignment-item">
                      <div className="assignment-info">
                        <h4>{a.title}</h4>
                        <p className="assignment-unit">
                          Unit: {a.unit?.title || "Unknown"} ({a.unit?.short_code || "N/A"})
                        </p>
                        <div className="assignment-dates">
                          {a.created_at && (
                            <p className="assignment-date-info">
                              <FiUpload size={14} /> Uploaded:{" "}
                              {new Date(a.created_at).toLocaleDateString()} {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          {a.due_date && (
                            <p className="assignment-date-info due">
                              <FiCalendar size={14} /> Deadline:{" "}
                              {new Date(a.due_date).toLocaleDateString()} {new Date(a.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {activeTab === "active" ? (
                          <button
                            onClick={() => setSelectedAssignment(a)}
                            className="work-button"
                          >
                            Work on Assignment
                          </button>
                        ) : (
                          <div className="completed-badge">
                            <FiCheckCircle size={20} /> Submitted
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiFileText className="empty-icon" size={48} />
                  <p>
                    No {activeTab} assignments at the moment. Check back later!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="marks-section animate-fade-in">
        <div className="section-header">
          <h2 className="section-title">Your Assignment Marks</h2>
          <p className="section-subtitle">Track your performance across all submitted and graded work.</p>
        </div>
        
        <div className="marks-card">
          <div className="table-wrapper">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Assignment Name</th>
                  <th>Unit Name</th>
                  <th>Status</th>
                  <th>Marks Awarded</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((a) => {
                    const isOverdue = a.due_date && new Date(a.due_date) < new Date();
                    const status = a.submission 
                      ? "Submitted" 
                      : (isOverdue ? "Failed to submit" : "Not submitted");
                    
                    const marks = a.submission?.status === "marked" 
                      ? `${a.submission.score} / 30` 
                      : (a.submission ? "Pending" : "-");

                    return (
                      <tr key={a.id}>
                        <td className="font-semibold">{a.title}</td>
                        <td>{a.unit?.title || "N/A"}</td>
                        <td>
                          <span className={`status-pill ${status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {status}
                          </span>
                        </td>
                        <td className="mark-value">{marks}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="empty-row">No assignments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
