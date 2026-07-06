import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import ConfirmModal from '../common/ConfirmModal';
import styles from './GroupSettingsModal.module.css';

export default function GroupSettingsModal({ conversation, onClose, onLeaveGroup }) {
  const { currentUser } = useAuth();
  const { users, updateGroupInfo, removeGroupMember } = useData();
  const [editName, setEditName] = useState(conversation.name || '');
  const [editDesc, setEditDesc] = useState(conversation.description || '');

  const [confirmModal, setConfirmModal] = useState({ visible: false, targetUserId: null });

  const isAdmin = currentUser?.id === conversation.adminId || currentUser?.id === conversation.hostId;
  const memberIds = conversation.members || conversation.participants || [];

  const formattedDate = conversation.createdAt 
    ? new Date(conversation.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  const handleSaveInfo = () => {
    const newName = editName.trim();
    const newDesc = editDesc.trim();
    if (newName !== conversation.name || newDesc !== (conversation.description || '')) {
      updateGroupInfo(conversation.id, newName || conversation.name, undefined, newDesc);
    }
  };

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (!isAdmin) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        updateGroupInfo(conversation.id, undefined, dataUrl, undefined);
      };
      reader.readAsDataURL(file);
    }
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const openRemoveConfirm = (userId) => {
    setConfirmModal({ visible: true, targetUserId: userId });
  };

  const confirmRemoveMember = () => {
    if (confirmModal.targetUserId) {
      removeGroupMember(conversation.id, confirmModal.targetUserId);
    }
    setConfirmModal({ visible: false, targetUserId: null });
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3 className={styles.title}>Group Details</h3>
            <button onClick={onClose} className={styles.closeBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.avatarSection}>
              <div 
                className={styles.largeAvatarWrapper} 
                style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                onClick={handleAvatarClick}
              >
                {isImageUrl(conversation.avatar) ? (
                  <img src={conversation.avatar} alt={conversation.name} className={styles.largeAvatarImg} />
                ) : (
                  <DefaultAvatar />
                )}
                {isAdmin && (
                  <div className={styles.avatarOverlay}>
                    Change
                  </div>
                )}
              </div>
              <div className={styles.dateCreated}>Created on {formattedDate}</div>
            </div>

            {isAdmin ? (
              <>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Group Name</div>
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      className={styles.groupInput}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Description</div>
                  <textarea
                    className={styles.descTextArea}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Add a group description..."
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={handleSaveInfo}
                    style={{ padding: '0.75rem', marginTop: '0.5rem' }}
                    disabled={editName === conversation.name && editDesc === (conversation.description || '')}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Group Name</div>
                  <div className={styles.descText}>{conversation.name}</div>
                </div>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Description</div>
                  <div className={styles.descText}>
                    {conversation.description || <span style={{ color: 'var(--color-text-muted)' }}>No description provided.</span>}
                  </div>
                </div>
              </>
            )}

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Members ({memberIds.length})</div>
              <div className={styles.memberList}>
                {memberIds.map(uid => {
                  const isMemberAdmin = uid === conversation.adminId || uid === conversation.hostId;
                  const isMe = uid === currentUser?.id;
                  
                  const userObj = Object.values(users).find(u => u.id === uid) || { 
                    id: uid, 
                    name: isMe ? currentUser?.name || 'You' : 'Unknown User', 
                    username: isMe ? currentUser?.username || 'you' : 'unknown'
                  };

                  return (
                    <div key={uid} className={styles.memberItem}>
                      <div className={styles.memberAvatar}>
                        {isImageUrl(userObj.avatar) ? (
                          <img src={userObj.avatar} alt={userObj.name} className={styles.avatarImg} />
                        ) : (
                          <DefaultAvatar />
                        )}
                      </div>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberName}>
                          {userObj.displayName || userObj.name} {isMe && '(You)'}
                        </div>
                        <div className={styles.memberRole}>
                          {isMemberAdmin ? <span className={styles.adminBadge}>Admin</span> : 'Member'}
                        </div>
                      </div>
                      {isAdmin && !isMe && !isMemberAdmin && (
                        <button className={styles.actionBtn} onClick={() => openRemoveConfirm(uid)}>
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button className={styles.leaveBtn} onClick={onLeaveGroup}>
              Leave Group
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        title="Remove Member"
        desc="Are you sure you want to remove this member from the group?"
        visible={confirmModal.visible}
        onCancel={() => setConfirmModal({ visible: false, targetUserId: null })}
        onConfirm={confirmRemoveMember}
        confirmText="Remove"
      />
    </>
  );
}
