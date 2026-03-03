// MyUnits.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "@elearning/shared";
import { FiSearch, FiBookOpen, FiGrid } from "react-icons/fi";
import "../styles/MyUnits.css"; // Import the CSS file

const MyUnits = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      try {    
        const res = await studentApi.getUnits();
        setUnits(res.data);
      } catch (err) {
        console.error("Error fetching enrolled units:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) =>
    unit.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your units...</p>
      </div>
    );
  }

  return (
    <div className="my-units-container animate-fade-in">
      <div className="units-header">
        <h1 className="header-title">My Units</h1>
        <div className="header-stats">
          <span className="stat-chip">
            <FiGrid size={16} />
            {units.length} {units.length === 1 ? "Unit" : "Units"}
          </span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search your units by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="units-grid">
        {filteredUnits.length > 0 ? (
          filteredUnits.map((unit) => (
            <div key={unit.id} className="unit-card">
              <div className="unit-header">
                <h3>{unit.title}</h3>
              </div>
              <div className="unit-content">
                <p className="unit-description">
                  {unit.description ||
                    "No description available for this unit."}
                </p>

                <div className="unit-stats">
                  <div className="stat-block">
                    <p className="stat-number">{unit.topicCount || 0}</p>
                    <p className="stat-label">Topics</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-block">
                    <p className="stat-number">{unit.liveClassCount || 0}</p>
                    <p className="stat-label">Live Classes</p>
                  </div>
                </div>

                <div className="unit-footer">
                  <span className="unit-program">
                    {unit.programTitle || "General Program"}
                  </span>
                  <button
                    onClick={() => navigate(`/dashboard/units/${unit.id}`)}
                    className="btn-unit-details"
                  >
                    Unit Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FiBookOpen className="empty-icon" />
            <p>No units found</p>
            {searchTerm && (
              <p className="empty-subtext">Try adjusting your search term</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUnits;
