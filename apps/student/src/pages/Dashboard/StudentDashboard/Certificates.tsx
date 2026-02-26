// Certificates.tsx
import React from "react";
import { FiAward } from "react-icons/fi";
import "../styles/Certificate.css"; // Import the CSS file

const Certificates = () => {
  return (
    <div className="certificates-container animate-fade-in">
      <div className="certificates-header">
        <h1 className="header-title">Certificates & Achievements</h1>
        <p className="header-subtitle">
          Your hard-earned certifications and badges.
        </p>
      </div>

      <div className="certificates-grid">
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <FiAward className="empty-icon" />
          </div>
          <h3>No Certificates Yet</h3>
          <p>
            Complete <span className="highlight">100% of a course</span> to earn
            your official certificate and showcase your skills to employers and
            peers!
          </p>
          <div style={{ marginTop: "1rem", width: "100%", maxWidth: "300px" }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "0%" }}></div>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--gray-500)",
                marginTop: "0.5rem",
              }}
            >
              Your journey starts here. Enroll in a course to begin!
            </p>
          </div>
        </div>

        {/* Example of what a certificate card would look like (commented out for future use) */}
        {/* <div className="certificate-card">
          <div className="certificate-header">
            <div className="certificate-icon">
              <FiAward />
            </div>
          </div>
          <div className="certificate-content">
            <h3 className="certificate-title">Advanced Web Development</h3>
            <p className="certificate-course">Course: Full Stack Development</p>
            <p className="certificate-date">
              <FiCalendar size={14} />
              Completed: March 15, 2024
            </p>
            <span className="certificate-badge">
              <FiAward size={12} />
              With Honors
            </span>
            <div className="certificate-actions">
              <button className="certificate-btn certificate-btn-primary">
                View Certificate
              </button>
              <button className="certificate-btn certificate-btn-secondary">
                Share
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Certificates;
