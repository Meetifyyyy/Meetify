import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import styles from './SettingsRoute.module.css';

export default function SettingsRoute() {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Account details state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Mock state for toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    if (activeTab === 'account') {
      updateProfile({ displayName, email, bio });
    }
    showToast('Settings saved successfully');
  };

  return (
    <main className="centre centre-wide animate-in">
      <div className={styles.settingsContainer}>
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.navBtn} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account Details
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'privacy' ? styles.active : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Notifications
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'appearance' ? styles.active : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </aside>

        <section className={styles.content}>
          {activeTab === 'account' && (
            <div className="animate-in">
              <h2 className={styles.sectionTitle}>Account Details</h2>
              <div className={styles.settingGroup}>
                <div className={styles.inputGroup}>
                  <label>Display Name</label>
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Username</label>
                  <input type="text" defaultValue={currentUser?.username} disabled />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Bio</label>
                  <input type="text" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="animate-in">
              <h2 className={styles.sectionTitle}>Privacy & Notifications</h2>
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Private Profile</span>
                    <span className={styles.settingDesc}>Only approved followers can see your posts.</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={privateProfile} onChange={e => setPrivateProfile(e.target.checked)} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Email Notifications</span>
                    <span className={styles.settingDesc}>Receive emails for important activity.</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={emailNotifs} onChange={e => setEmailNotifs(e.target.checked)} />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Push Notifications</span>
                    <span className={styles.settingDesc}>Receive browser push notifications.</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={pushNotifs} onChange={e => setPushNotifs(e.target.checked)} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <button className={styles.saveBtn} onClick={handleSave}>Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-in">
              <h2 className={styles.sectionTitle}>Appearance</h2>
              <div className={styles.settingGroup}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Dark Mode</span>
                    <span className={styles.settingDesc}>Toggle experimental dark mode (coming soon).</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={darkMode} onChange={e => {
                      setDarkMode(e.target.checked);
                      showToast('Dark mode is currently in development');
                    }} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
