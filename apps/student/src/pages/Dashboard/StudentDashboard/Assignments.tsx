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
} from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/Assignments.css"; // Import the CSS file

const Assignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState("");
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
      await studentApi.submitAssignment(selectedAssignment.id, {
        file_url: fileUrl,
        answer_text: answerText,
      });
      toast.success("Assignment submitted successfully");

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                submission: {
                  status: "submitted",
                  submitted_at: new Date().toISOString(),
                  file_url: fileUrl,
                },
              }
            : a,
        ),
      );

      setSelectedAssignment(null);
      setFileUrl("");
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
              <div 
                className="assignment-description"
                dangerouslySetInnerHTML={{ __html: selectedAssignment.description }}
              />


              <div className="submission-form">
                <h4 className="form-title">Submit Your Work</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Upload Document (URL)</label>
                    <div className="input-wrapper">
                      <FiUpload />
                      <input
                        type="text"
                        placeholder="https://link-to-your-document.com"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <p className="input-hint">
                      * Provide a link to your uploaded assignment/document.
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
                    disabled={submitting || (!fileUrl && !answerText)}
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
                          Unit: {a.course || "Unknown"}
                        </p>
                        {a.due_date && (
                          <p className="assignment-due">
                            <FiCalendar /> Due:{" "}
                            {new Date(a.due_date).toLocaleDateString()}
                          </p>
                        )}
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
    </div>
  );
};

export default Assignments;
