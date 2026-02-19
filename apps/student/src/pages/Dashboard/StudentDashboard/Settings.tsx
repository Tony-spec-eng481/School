import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiTarget } from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Settings Nav */}
        <aside style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: activeTab === 'profile' ? '#eff6ff' : 'transparent', color: activeTab === 'profile' ? 'var(--student-primary)' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}
          >
            <FiUser /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: activeTab === 'security' ? '#eff6ff' : 'transparent', color: activeTab === 'security' ? 'var(--student-primary)' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}
          >
            <FiLock /> Security
          </button>
          <button 
            onClick={() => setActiveTab('goals')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: activeTab === 'goals' ? '#eff6ff' : 'transparent', color: activeTab === 'goals' ? 'var(--student-primary)' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}
          >
            <FiTarget /> Learning Goals
          </button>
        </aside>

        {/* Settings Content */}
        <main style={{ flex: 1, background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--student-border)' }}>
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Personal Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Full Name</label>
                   <input type="text" defaultValue={localStorage.getItem('userName') || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)' }} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                   <input type="email" defaultValue={localStorage.getItem('userEmail') || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)' }} />
                </div>
                <button style={{ padding: '0.75rem 1.5rem', background: 'var(--student-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, alignSelf: 'flex-start' }}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
             <div>
               <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Change Password</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Current Password</label>
                   <input type="password" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)' }} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>New Password</label>
                   <input type="password" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--student-border)' }} />
                </div>
                <button style={{ padding: '0.75rem 1.5rem', background: 'var(--student-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, alignSelf: 'flex-start' }}>Update Password</button>
              </div>
             </div>
          )}

          {activeTab === 'goals' && (
             <div style={{ textAlign: 'center', padding: '3rem' }}>
                <FiTarget size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <p style={{ color: '#64748b' }}>Set your weekly learning targets here. (Coming Soon)</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
