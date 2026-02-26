// UnitDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentApi } from "@elearning/shared";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiPlayCircle,
  FiFile,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import PlyrPlayer from "../../../components/PlyrPlayer";
import toast from "react-hot-toast";
import "../styles/UnitDetails.css"; // Import the CSS file

const UnitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getUnitDetails(id!);
        const fetchedUnit = res.data;
        setUnit(fetchedUnit);

        // Auto-select the first topic (preferably uncompleted)
        if (fetchedUnit?.topics?.length > 0) {
          const firstUncompleted = fetchedUnit.topics.find(
            (t: any) => !t.isCompleted,
          );
          setCurrentTopicId(
            firstUncompleted ? firstUncompleted.id : fetchedUnit.topics[0].id,
          );
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error || err?.message || "Unknown error";
        console.error("[UnitDetails] Error fetching unit details:", err);
        console.error("[UnitDetails] Error details:", errorMsg);
        toast.error(`Failed to load unit details: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUnit();
  }, [id]);

  const handleNextTopic = async () => {
    if (!currentTopicId || !unit?.topics) return;

    const currentIndex = unit.topics.findIndex(
      (t: any) => t.id === currentTopicId,
    );
    if (currentIndex === -1) return;

    const currentTopic = unit.topics[currentIndex];

    try {
      // API call to mark as complete. Passing unit ID as courseId placeholder if needed.
      await studentApi.markTopicComplete({
        topicId: currentTopic.id,
        courseId: id || "",
      });

      // Auto-update topic array to set current one as completed
      setUnit((prev: any) => {
        const nextTopics = [...prev.topics];
        nextTopics[currentIndex] = {
          ...nextTopics[currentIndex],
          isCompleted: true,
        };
        return { ...prev, topics: nextTopics };
      });
      toast.success("Topic completed!");

      // Move to the next topic or show success if finished
      if (currentIndex < unit.topics.length - 1) {
        setCurrentTopicId(unit.topics[currentIndex + 1].id);
        // Scroll to top of the viewer if needed
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.success("You have completed all topics for this unit!");
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.message || "Unknown error";
      console.error("[UnitDetails] Error marking topic as complete:", err);
      console.error("[UnitDetails] Error details:", errorMsg);
      toast.error(`Failed to update progress: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading unit details...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="loading-container">
        <p className="loading-text">Unit not found.</p>
      </div>
    );
  }

  const currentTopic = unit.topics?.find((t: any) => t.id === currentTopicId);
  const isLastTopic =
    unit.topics && currentTopicId === unit.topics[unit.topics.length - 1]?.id;

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="unit-details-container animate-fade-in">
      {/* MAIN CONTENT AREA (LEFT SIDE) */}
      <div className="main-content-area">
        {/* Header Block */}
        <div>
          <button
            onClick={() => navigate("/dashboard/units")}
            className="back-button"
          >
            <FiArrowLeft /> Back to My Units
          </button>

          <div className="card unit-header">
            <h1 className="unit-title">{unit.title}</h1>
            <p className="unit-description">{unit.description}</p>
          </div>
        </div>

        {/* Current Topic Viewer Block */}
        {currentTopic ? (
          <div className="card topic-viewer">
            <h2 className="topic-title">{currentTopic.title}</h2>

            {/* 1) Optional Audio Intro */}
            {currentTopic.audio_intro_url && (
              <div className="audio-section">
                <p className="audio-label">Introduction Audio</p>
                <PlyrPlayer url={currentTopic.audio_intro_url} type="audio" />
              </div>
            )}

            {/* 2) Plyr Player (Video Lesson) */}
            {currentTopic.video_url && (
              <div className="video-container">
                <PlyrPlayer url={currentTopic.video_url} type="video" />
              </div>
            )}

            {/* 3) Notes Area */}
            {(currentTopic.notes || currentTopic.notes_url) && (
              <div className="notes-section">
                <h3 className="notes-title">Lesson Notes</h3>
                {currentTopic.notes_url || isUrl(currentTopic.notes) ? (
                  <div className="pdf-notes-container">
                    <div className="pdf-actions">
                      <a
                        href={currentTopic.notes_url || currentTopic.notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-btn"
                      >
                        <FiEye /> Read Online
                      </a>
                      <a
                        href={currentTopic.notes_url || currentTopic.notes}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-btn"
                      >
                        <FiDownload /> Download Notes
                      </a>
                    </div>
                    <iframe
                      src={currentTopic.notes_url || currentTopic.notes}
                      className="pdf-viewer"
                      title="PDF Notes"
                      style={{ width: "100%", height: "600px", border: "none" }}
                    />
                  </div>
                ) : (
                  <div
                    className="notes-content"
                    dangerouslySetInnerHTML={{ __html: currentTopic.notes }}
                  />
                )}
              </div>
            )}

            {/* Next / Completion Button Action */}
            <div className="topic-actions">
              <span
                className={`topic-status ${currentTopic.isCompleted ? "completed" : ""}`}
              >
                {currentTopic.isCompleted ? <>✓ Completed</> : "In Progress"}
              </span>

              <button
                onClick={handleNextTopic}
                disabled={currentTopic.isCompleted && isLastTopic}
                className={`next-button ${currentTopic.isCompleted && isLastTopic ? "completed" : ""}`}
              >
                {currentTopic.isCompleted
                  ? isLastTopic
                    ? "All Topics Completed"
                    : "Next Topic"
                  : "Mark Complete & Next"}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{
              textAlign: "center",
              color: "var(--gray-500)",
              padding: "3rem",
            }}
          >
            No topic selected or available.
          </div>
        )}

        {/* Assignments Block (Shown below topics in main area) */}
        {unit.assignments && unit.assignments.length > 0 && (
          <div className="card assignments-section">
            <h2 className="assignments-title">Unit Assignments</h2>
            <div>
              {unit.assignments.map((assignment: any) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-info">
                    <h4>
                      <FiFileText /> {assignment.title}
                    </h4>
                    <p>{assignment.description}</p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/assignments")}
                    className="assignment-button"
                  >
                    Submit Work
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIDEBAR (RIGHT SIDE) */}
      <div className="unit-details-sidebar">
        <div className="topics-sidebar">
          <div className="topics-header">
            <h2>Unit Topics</h2>
            <span className="topics-count">
              {unit.topics?.filter((t: any) => t.isCompleted).length || 0}/
              {unit.topics?.length || 0}
            </span>
          </div>

          <div className="topics-list">
            {unit.topics && unit.topics.length > 0 ? (
              unit.topics.map((topic: any, index: number) => {
                const isActive = topic.id === currentTopicId;
                const isCompleted = topic.isCompleted;

                return (
                  <button
                    key={topic.id}
                    onClick={() => setCurrentTopicId(topic.id)}
                    className={`topic-item ${isActive ? "active" : ""}`}
                  >
                    {/* Status Circle */}
                    <div
                      className={`topic-status-icon ${isCompleted ? "completed" : isActive ? "active" : "default"}`}
                    >
                      {isCompleted ? <FiCheckCircle size={16} /> : index + 1}
                    </div>

                    {/* Topic Name and Type */}
                    <div className="topic-info">
                      <h4 className="topic-name">{topic.title}</h4>
                      <div className="topic-type">
                        {topic.content_type === "video" ? (
                          <FiPlayCircle size={12} />
                        ) : (
                          <FiFile size={12} />
                        )}
                        <span>
                          {topic.content_type === "video"
                            ? "Video Lesson"
                            : "Reading"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p
                style={{
                  color: "var(--gray-500)",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "1rem",
                }}
              >
                No topics available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetails;
