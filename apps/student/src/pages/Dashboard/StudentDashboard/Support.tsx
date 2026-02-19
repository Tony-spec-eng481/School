import React, { useState, useEffect } from 'react';
import { studentApi } from '@elearning/shared';
import { FiMessageSquare, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';

const Support = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'medium' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await studentApi.getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentApi.createTicket(newTicket);
      setIsModalOpen(false);
      setNewTicket({ subject: '', message: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  };

  if (loading) return <div>Loading support...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Support & Messaging</h2>
          <p style={{ color: '#64748b' }}>Need help? Open a support ticket or contact your teacher.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--student-primary)', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FiMessageSquare /> New Ticket
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--student-border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--student-border)', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Your Support Tickets</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--student-border)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Subject</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Priority</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map(ticket => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{ticket.subject}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.625rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: ticket.status === 'open' ? '#dcfce7' : ticket.status === 'in_progress' ? '#fef9c3' : '#f1f5f9',
                        color: ticket.status === 'open' ? '#166534' : ticket.status === 'in_progress' ? '#854d0e' : '#475569'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{ticket.priority}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                       {new Date(ticket.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No support tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Basic Modal for New Ticket */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
           <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Open New Support Ticket</h2>
              <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Subject</label>
                   <input 
                     required 
                     type="text" 
                     value={newTicket.subject} 
                     onChange={e => setNewTicket({...newTicket, subject: e.target.value})} 
                     style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', outline: 'none' }} 
                   />
                 </div>
                 <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Priority</label>
                   <select 
                     value={newTicket.priority} 
                     onChange={e => setNewTicket({...newTicket, priority: e.target.value})} 
                     style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', background: 'white' }}
                   >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                     <option value="urgent">Urgent</option>
                   </select>
                 </div>
                 <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Message</label>
                   <textarea 
                     required 
                     rows={4} 
                     value={newTicket.message} 
                     onChange={e => setNewTicket({...newTicket, message: e.target.value})} 
                     style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', outline: 'none', resize: 'none' }} 
                   ></textarea>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)', background: 'white', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: 'var(--student-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Submit Ticket</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Support;
