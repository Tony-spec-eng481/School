import React from 'react';
import { FiFileText, FiCalendar, FiClock } from 'react-icons/fi';

const Assignments = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Assignments & Quizzes</h2>
        <p style={{ color: '#64748b' }}>Complete your tasks to track your understanding and earn grades.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--student-border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--student-border)', display: 'flex', gap: '1rem' }}>
           <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'var(--student-primary)', color: 'white', border: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Active</button>
           <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'white', border: '1px solid var(--student-border)', fontSize: '0.875rem' }}>Completed</button>
        </div>

        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
           <FiFileText size={48} style={{ color: '#cbd5e1', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
           <p>No active assignments at the moment. Check back later!</p>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
