import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';

export default function CommunityAdminModal({ community, onClose }) {
  const { updateCommunity, kickMember } = useData();
  const [activeTab, setActiveTab] = useState('details');

  // Details State
  const [name, setName] = useState(community.name || '');
  const [desc, setDesc] = useState(community.desc || '');
  const [avatar, setAvatar] = useState(community.avatar || '');
  const [coverImage, setCoverImage] = useState(community.coverImage || '');
  const [interests, setInterests] = useState(community.interests ? community.interests.join(', ') : '');
  const [rules, setRules] = useState(community.rules ? community.rules.join('\n') : '');
  
  // Settings State
  const [requireApproval, setRequireApproval] = useState(community.requireApproval || false);
  const [allowMemberPosts, setAllowMemberPosts] = useState(community.allowMemberPosts !== false);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim()) {
      showToast('Name and Description are required');
      return;
    }
    setIsSaving(true);

    const parsedInterests = interests.split(',').map(i => i.trim()).filter(i => i);
    const parsedRules = rules.split('\n').map(g => g.trim()).filter(g => g);

    await updateCommunity(community.id, {
      name,
      desc,
      avatar,
      coverImage,
      interests: parsedInterests,
      rules: parsedRules
    });
    setIsSaving(false);
    showToast('Community details updated!');
  };

  const handleKick = async (memberId) => {
    if (window.confirm('Are you sure you want to kick this member? They will be banned from joining for 7 days.')) {
      await kickMember(community.id, memberId);
      showToast('Member kicked successfully');
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="no-scrollbar" style={{ background: 'var(--color-bg-white)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-premium)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-family-display)' }}>Admin Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)' }}>
          {['details', 'members', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: '0.5rem 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <form onSubmit={handleSaveDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Interests (Comma separated)</label>
              <input type="text" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. UI/UX, Figma, Typography" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Rules (One per line)</label>
              <textarea value={rules} onChange={e => setRules(e.target.value)} placeholder="e.g. Be respectful&#10;No spamming" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-bg-main)', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={isSaving} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        )}

        {activeTab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(community.memberList || []).map(member => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} alt={member.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{member.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{member.role || 'Member'}</div>
                  </div>
                </div>
                {!member.admin && (
                  <button onClick={() => handleKick(member.id)} style={{ padding: '0.5rem 1rem', background: 'var(--color-danger, #ef4444)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500 }}>
                    Kick
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Require Approval to Join</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Users must be approved by an admin before they can participate.</div>
              </div>
              <input 
                type="checkbox" 
                checked={requireApproval}
                onChange={async (e) => {
                  setRequireApproval(e.target.checked);
                  await updateCommunity(community.id, { requireApproval: e.target.checked });
                  showToast('Settings updated');
                }}
                style={{ width: '1.2rem', height: '1.2rem' }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Allow Member Posts</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>If disabled, only admins can create new posts in the community.</div>
              </div>
              <input 
                type="checkbox" 
                checked={allowMemberPosts}
                onChange={async (e) => {
                  setAllowMemberPosts(e.target.checked);
                  await updateCommunity(community.id, { allowMemberPosts: e.target.checked });
                  showToast('Settings updated');
                }}
                style={{ width: '1.2rem', height: '1.2rem' }} 
              />
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
