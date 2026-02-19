import React, { useState, useEffect } from 'react';
import { studentApi } from '@elearning/shared';
import { FiBell, FiInfo, FiAlertCircle } from 'react-icons/fi';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await studentApi.getAnnouncements();
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Announcements</h2>
        <p style={{ color: '#64748b' }}>Stay updated with the latest news from your school and instructors.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.length > 0 ? (
          announcements.map(ann => (
            <div key={ann.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--student-border)', display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 }}>
                {ann.target_role === 'all' ? <FiInfo /> : <FiAlertCircle />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{ann.title}</h3>
                   <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                     {new Date(ann.created_at).toLocaleDateString()}
                   </span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>{ann.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dotted var(--student-border)' }}>
             <FiBell size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
             <p style={{ color: '#64748b' }}>No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
