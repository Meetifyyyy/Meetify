import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './NewMessageModal.module.css';

export default function NewMessageModal({ onClose, onStartChat, onCreateGroup }) {
  const { currentUser } = useAuth();
  const { users } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [mode, setMode] = useState('single'); // 'single', 'multi_select', 'group_name'
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupName, setGroupName] = useState('');

  const allUsers = Object.values(users || {}).filter(
    (u) => u.username !== currentUser?.username
  );

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (user) => {
    if (mode === 'single') {
      onStartChat(user);
    } else if (mode === 'multi_select') {
      setSelectedUserIds((prev) => 
        prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
      );
    }
  };

  const handleCreateGroupClick = () => {
    setMode('multi_select');
  };

  const handleNextClick = () => {
    if (selectedUserIds.length > 0) {
      setMode('group_name');
    }
  };

  const handleBackClick = () => {
    if (mode === 'group_name') {
      setMode('multi_select');
    } else if (mode === 'multi_select') {
      setMode('single');
      setSelectedUserIds([]);
    }
  };

  const handleFinalCreateGroup = async () => {
    if (!groupName.trim()) return;
    await onCreateGroup(groupName.trim(), selectedUserIds);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {mode !== 'single' ? (
            <button onClick={handleBackClick} className={styles.closeBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button onClick={onClose} className={styles.closeBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          
          <h3 className={styles.title}>
            {mode === 'single' && 'New Message'}
            {mode === 'multi_select' && 'New Group'}
            {mode === 'group_name' && 'Name Group'}
          </h3>
          
          {mode === 'multi_select' ? (
            <button className={styles.headerBtn} onClick={handleNextClick} disabled={selectedUserIds.length === 0}>
              Next
            </button>
          ) : (
            <div style={{ width: 28 }}></div> /* spacer */
          )}
        </div>

        {mode !== 'group_name' && (
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        <div className={styles.body}>
          {mode === 'group_name' ? (
            <div className={styles.groupSetup}>
              <div>
                <label className={styles.groupSetupLabel}>Group Name</label>
                <input 
                  type="text" 
                  className={styles.groupInput}
                  placeholder="E.g., Weekend Hike"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  autoFocus
                />
              </div>
              <button 
                className={styles.createGroupBtn} 
                disabled={!groupName.trim()}
                onClick={handleFinalCreateGroup}
              >
                Create Group
              </button>
            </div>
          ) : (
            <>
              {mode === 'single' && !searchQuery && (
                <div className={styles.actionRow} onClick={handleCreateGroupClick}>
                  <div className={styles.actionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className={styles.actionText}>Create a group</div>
                </div>
              )}

              <div className={styles.sectionTitle}>
                {searchQuery ? 'Search Results' : (mode === 'multi_select' ? 'Add new members' : 'Suggested')}
              </div>

              {filteredUsers.length === 0 ? (
                <div className={styles.empty}>
                  No accounts found matching "{searchQuery}".
                </div>
              ) : (
                filteredUsers.map((user, i) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id || i}
                      className={`${styles.userItem} ${isSelected ? styles.selectedItem : ''}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <div className={styles.userAvatar}>
                        {isImageUrl(user.avatar) ? (
                          <img
                            src={user.avatar}
                            alt={user.displayName || user.name || user.username}
                            className={styles.avatarImg}
                          />
                        ) : (
                          <DefaultAvatar />
                        )}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          {user.displayName || user.name || user.username}
                        </div>
                        <div className={styles.userUsername}>@{user.username}</div>
                      </div>
                      {mode === 'multi_select' && (
                        <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
