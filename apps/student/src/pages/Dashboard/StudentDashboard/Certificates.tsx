import React from 'react';
import { FiAward } from 'react-icons/fi';

const Certificates = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Certificates & Achievements</h2>
        <p style={{ color: '#64748b' }}>Your hard-earned certifications and badges.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dotted var(--student-border)' }}>
          <FiAward size={64} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Certificates Yet</h3>
          <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            Complete 100% of a course to earn your official certificate and showcase your skills!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
