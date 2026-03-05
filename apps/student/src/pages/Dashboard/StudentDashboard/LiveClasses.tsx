import React, { useState, useEffect } from "react";
import { studentApi } from "@elearning/shared";
import {
  FiVideo,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiUsers,
} from "react-icons/fi";
import "../styles/LiveClasses.css";

const LiveClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await studentApi.getLiveClasses();
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching live classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClasses();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading live classes...</p>
      </div>
    );
  }

  const liveCount = classes.filter((c) => c.status === "live").length;
  const scheduledCount = classes.filter((c) => c.status === "scheduled").length;

  const openLiveClass = (url: string) => {
    window.open(`/live-classes/room/${url}`, // "_blank",
      "noopener,noreferrer");
  };

  return (
    <div className="live-classes-container animate-fade-in">
      <div className="classes-header">
        <h1 className="header-title">Live Classes</h1>
        <p className="header-subtitle">
          Join your instructors for real-time learning sessions.
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-badge live">
          <span className="pulse-dot"></span>
          {liveCount} Live {liveCount === 1 ? "Class" : "Classes"}
        </div>
        <div className="stat-badge">
          <FiCalendar size={16} />
          {scheduledCount} Scheduled
        </div>
        <div className="stat-badge">
          <FiUsers size={16} />
          {classes.length} Total
        </div>
      </div>

      <div className="classes-grid">
        {classes.length > 0 ? (
          classes.map((lc) => (
            <div
              key={lc.id}
              className={`class-card ${lc.status === "live" ? "live" : ""}`}
            >
              <div className="card-content">
                <div className="status-badges">
                  <span
                    className={`status-badge ${lc.status === "live" ? "live" : "scheduled"}`}
                  >
                    {lc.status === "live" ? (
                      <>
                        {" "}
                        <span className="live-indicator"></span> LIVE NOW{" "}
                      </>
                    ) : (
                      "SCHEDULED"
                    )}
                  </span>
                  <span className="status-badge unit">
                    {lc.course || "General"}
                  </span>
                </div>

                <h3 className="class-title">{lc.title}</h3>

                <div className="class-details">
                  <div className="detail-item">
                    <FiCalendar />{" "}
                    <span>
                      {new Date(lc.startTime).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FiClock />{" "}
                    <span>
                      {new Date(lc.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      {lc.duration && <> • {lc.duration} min</>}
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  {(lc.status === "live" || lc.status === "scheduled") &&
                  lc.live_url ? (
                    <button
                      className={`join-button ${lc.status === "live" ? "live" : "scheduled"}`}
                      onClick={() => openLiveClass(lc.live_url)}
                    >
                      {lc.status === "live" ? "Join Class" : "Enter Class"}{" "}
                      <FiVideo size={16} />
                    </button>
                  ) : (
                    <button disabled className="disabled-button">
                      Not Started
                    </button>
                  )}
                  {lc.recordingUrl && (
                    <a
                      href={lc.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recording-button"
                      data-tooltip="View Recording"
                    >
                      <FiExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <FiVideo className="empty-icon" />
            </div>
            <h3>No Live Classes Scheduled</h3>
            <p>
              There are no live classes scheduled at the moment. Check back
              later or explore your course materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;
