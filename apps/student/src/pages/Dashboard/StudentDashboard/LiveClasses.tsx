import React, { useState, useEffect } from 'react';
import { studentApi } from '@elearning/shared';
import { FiVideo, FiCalendar, FiClock, FiExternalLink } from 'react-icons/fi';

const LiveClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await studentApi.getLiveClasses();
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching live classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClasses();
  }, []);

  if (loading) return <div>Loading live classes...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upcoming Live Classes</h2>
        <p style={{ color: '#64748b' }}>Join your instructors for real-time learning sessions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {classes.length > 0 ? (
          classes.map(lc => (
            <div key={lc.id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--student-border)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: lc.status === 'live' ? '#fee2e2' : '#f1f5f9', color: lc.status === 'live' ? '#ef4444' : '#64748b', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {lc.status === 'live' ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></span> LIVE NOW</> : 'SCHEDULED'}
                  </span>
                  <span style={{ padding: '0.25rem 0.5rem', background: '#e0f2fe', color: '#0284c7', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {lc.course || 'General'}
                  </span>
                </div>
                
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>{lc.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <FiCalendar size={14} /> {new Date(lc.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <FiClock size={14} /> {new Date(lc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {lc.status === 'live' ? (
                    <a 
                      href={lc.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: 'var(--student-primary)', color: 'white', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      Join Class <FiExternalLink size={16} />
                    </a>
                  ) : (
                    <button 
                      disabled
                      style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#94a3b8', borderRadius: '0.5rem', fontWeight: 600, border: 'none' }}
                    >
                      Not Started
                    </button>
                  )}
                  {lc.recordingUrl && (
                    <a 
                      href={lc.recordingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ padding: '0.75rem', background: 'white', border: '1px solid var(--student-border)', borderRadius: '0.5rem', color: 'var(--student-text)' }}
                    >
                      Recording
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dotted var(--student-border)' }}>
             <FiVideo size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
             <p style={{ color: '#64748b' }}>No live classes scheduled at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;
