import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartBack } from '../../hooks/useSmartBack';
import { useData } from '../../context/DataContext';
import { useSimulatedFetch } from '../../hooks/useSimulatedFetch';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import Skeleton from '../common/Skeleton';
import { ErrorState, EmptyState } from '../common/StateViews';
import { MessageSquarePlus } from 'lucide-react';
import NewMessageModal from './NewMessageModal';
import PageHeader from '../layout/PageHeader';
import styles from './ConversationList.module.css';

function ConversationSkeleton() {
  return (
    <div style={{ display: 'flex', padding: '0.8rem 1.25rem', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--color-border-light)' }}>
      <Skeleton type="circle" width="48px" height="48px" />
      <div style={{ flex: 1 }}>
        <Skeleton type="text" width="50%" height="1rem" style={{ marginBottom: '6px' }} />
        <Skeleton type="text" width="80%" height="0.8rem" />
      </div>
    </div>
  );
}

export default function ConversationList({ conversations, activeChatId, onSelect, showChatOnMobile }) {
  const navigate = useNavigate();
  const { startConversation, createGroupConversation, crewActivities } = useData();
  const [contextMenu, setContextMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Chats');
  const [searchVal, setSearchVal] = useState('');
  const goBack = useSmartBack();

  useEffect(() => {
    if (activeChatId != null && conversations) {
      const cleanAid = String(activeChatId).replace(/^(act_)+/, '');
      const activeC = conversations.find(c => {
        if (!c) return false;
        const cleanCid = String(c.id).replace(/^(act_)+/, '');
        const cleanActId = c.activityId ? String(c.activityId).replace(/^(act_)+/, '') : null;
        return cleanCid === cleanAid || cleanActId === cleanAid;
      });
      if (activeC && (activeC.isActivityChat || activeC.isTemporary || String(activeChatId).startsWith('act_'))) {
        setSelectedTab('Activity');
      }
    }
  }, [activeChatId, conversations]);

  const filteredInputConvs = useMemo(() => {
    return (conversations || []).filter(c => {
      const isActChat = c.isActivityChat || c.isTemporary;
      
      if (selectedTab === 'Activity') {
        if (!isActChat) return false;
        
        // Setup proper logic to remove temporary chat 4 hours after activity finishes
        if (c.activityId && crewActivities) {
           const activity = crewActivities.find(a => a.id === c.activityId);
           if (!activity) return false;
           if (activity.date && activity.time) {
             // Mock parsing of activity date + time
             // We assume activity duration is roughly 2 hours for calculation
             const activityDateStr = `${activity.date} ${activity.time.split(' - ')[0]}`;
             const activityTime = new Date(activityDateStr).getTime();
             if (!isNaN(activityTime)) {
               const fourHoursMs = 4 * 60 * 60 * 1000;
               const durationMs = 2 * 60 * 60 * 1000; // rough duration
               // Filter out if current time is past (activity start + duration + 4 hours)
               if (Date.now() > activityTime + durationMs + fourHoursMs) {
                 return false;
               }
             }
           }
        }
        return true;
      } else {
        return !isActChat;
      }
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [conversations, selectedTab, crewActivities]);

  const { isLoading, data: loadedConvs, error, retry } = useSimulatedFetch(filteredInputConvs, 800);

  const searchedConvs = useMemo(() => {
    if (!searchVal.trim()) return loadedConvs || [];
    const term = searchVal.toLowerCase();
    return (loadedConvs || []).filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.lastMsg && c.lastMsg.toLowerCase().includes(term))
    );
  }, [loadedConvs, searchVal]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e, convId) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      convId
    });
  };

  const handleStartChat = async (targetUser) => {
    const newConvId = await startConversation(targetUser);
    setIsModalOpen(false);
    onSelect(newConvId);
  };

  const handleCreateGroup = async (groupName, userIds) => {
    const newConvId = await createGroupConversation(groupName, userIds);
    setIsModalOpen(false);
    onSelect(newConvId);
  };

  return (
    <div className={`${styles.msgConvList}${showChatOnMobile ? ` ${styles.hideOnMobile}` : ''}`}>
      <div className={styles.mobileHeaderWrapper}>
        <PageHeader
          title="Messages"
          backPath="/home"
          searchProps={{
            value: searchVal,
            onChange: (e) => setSearchVal(e.target.value),
            placeholder: 'Search conversations...',
          }}
          actions={
            <button className={styles.msgNewBtn} title="New Message" onClick={() => setIsModalOpen(true)}>
              <MessageSquarePlus size={20} />
            </button>
          }
        />
        <div className={styles.tabsRow}>
          {['Chats', 'Activity'].map(tab => (
            <button 
              key={tab} 
              className={`${styles.tabBtn} ${selectedTab === tab ? styles.activeTab : ''}`} 
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.desktopHeaderWrapper}>
        <div className={styles.msgConvHeader}>
          <div className={styles.titleGroup}>
            <button 
              className={styles.backBtn}
              onClick={() => goBack('/home')}
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h2 className={styles.msgConvTitle}>Messages</h2>
          </div>
          <button className={styles.msgNewBtn} title="New Message" onClick={() => setIsModalOpen(true)}>
            <MessageSquarePlus size={20} />
          </button>
        </div>
        <div className={styles.tabsRow}>
          {['Chats', 'Activity'].map(tab => (
            <button 
              key={tab} 
              className={`${styles.tabBtn} ${selectedTab === tab ? styles.activeTab : ''}`} 
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.searchRow}>
          <div className={styles.msgConvSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              className={styles.msgSearchInput} 
              placeholder="Search conversations..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.msgConvScroll}>
        {isLoading && (
          <>
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
          </>
        )}

        {!isLoading && error && (
          <div style={{ padding: '2rem 1rem' }}>
            <ErrorState onRetry={retry} />
          </div>
        )}

        {!isLoading && !error && searchedConvs && searchedConvs.length === 0 && (
          <div style={{ padding: '2rem 1rem' }}>
            <EmptyState 
              title="No chats found" 
              message="No conversations match your search criteria." 
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
            />
          </div>
        )}

        {!isLoading && !error && searchedConvs && searchedConvs.map((conv) => {
          const avatarRadius = '50%';
          const cleanAid = activeChatId != null ? String(activeChatId).replace(/^(act_)+/, '') : null;
          const cleanCid = String(conv.id).replace(/^(act_)+/, '');
          const cleanActId = conv.activityId ? String(conv.activityId).replace(/^(act_)+/, '') : null;
          const isMatch = cleanAid != null && (cleanCid === cleanAid || cleanActId === cleanAid);
          const isUnread = conv.unread > 0;
          return (
            <div
              key={conv.id}
              className={`${styles.convItem}${isMatch ? ` ${styles.convItemActive}` : ''}`}
              onClick={() => onSelect(conv.id)}
              onContextMenu={(e) => handleContextMenu(e, conv.id)}
            >
              <div 
                className={styles.convAvatar} 
                style={{ 
                  background: isImageUrl(conv.avatar) ? 'none' : conv.color,
                  borderRadius: avatarRadius
                }}
              >
                {isImageUrl(conv.avatar) ? (
                  <img 
                    src={conv.avatar} 
                    alt={conv.name} 
                    className={styles.convAvatarImg} 
                    style={{ borderRadius: avatarRadius }}
                  />
                ) : (
                  <DefaultAvatar />
                )}
                {conv.online && !conv.isGroup && !conv.isActivityChat && (
                  <span className={styles.convOnlineDot} />
                )}
              </div>
              <div className={styles.convInfo}>
                <div className={styles.convNameRow}>
                  <span className={`${styles.convNameText} ${isUnread ? styles.convNameTextUnread : ''}`}>{conv.name}</span>
                  <div className={styles.convTags}>
                    {conv.isActivityChat && <span className={styles.tagActivity}>Crew</span>}
                    {conv.isGroup && !conv.isActivityChat && <span className={styles.tagGroup}>Group</span>}
                  </div>
                </div>
                <div className={`${styles.convPreview} ${isUnread ? styles.convPreviewUnread : ''}`}>{conv.lastMsg}</div>
              </div>
              <div className={styles.convMeta}>
                <span className={`${styles.convTime} ${isUnread ? styles.convTimeUnread : ''}`}>{conv.time}</span>
                {isUnread && <span className={styles.convBadge}>{conv.unread}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {contextMenu && (
        <div 
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setContextMenu(null)}>Mark as unread</button>
          <button onClick={() => setContextMenu(null)}>Mute notifications</button>
          <button className={styles.deleteBtn} onClick={() => setContextMenu(null)}>Delete chat</button>
        </div>
      )}

      {isModalOpen && (
        <NewMessageModal
          onClose={() => setIsModalOpen(false)}
          onStartChat={handleStartChat}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}
