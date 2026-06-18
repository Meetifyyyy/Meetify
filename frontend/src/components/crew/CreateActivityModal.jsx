import { useState, useEffect } from 'react';
import { ACTIVITY_CATEGORIES } from './crewData';
import styles from './CreateActivityModal.module.css';

export default function CreateActivityModal({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop',
    tags: '',
    date: '',
    time: '',
    duration: '1 hour',
    location: '',
    isOnline: false,
    participationType: 'open',
    slotsNeeded: 2,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handlePublish = () => {
    const newActivity = {
      id: `act_${Date.now()}`,
      hostId: 'current_user',
      hostName: 'You',
      hostUsername: 'currentUser',
      hostAvatar: '',
      hostCollege: 'University',
      hostVerified: true,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      dateLabel: 'Today',
      date: formData.date || new Date().toISOString(),
      time: formData.time || '10:00 AM',
      duration: formData.duration,
      location: formData.location || (formData.isOnline ? 'Online' : 'TBD'),
      isOnline: formData.isOnline,
      participationType: formData.participationType,
      slotsNeeded: parseInt(formData.slotsNeeded, 10),
      slotsFilled: 1,
      participants: ['current_user'],
      requests: []
    };
    onPublish(newActivity);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Create Activity</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          {step === 1 && (
            <div className={styles.step}>
              <h3>Choose a Category</h3>
              <div className={styles.categories}>
                {ACTIVITY_CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    className={`${styles.catBtn} ${formData.category === cat ? styles.active : ''}`}
                    onClick={() => setFormData({ ...formData, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.step}>
              <h3>Basic Information</h3>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="E.g., Weekend Cricket Match"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What is this activity about?"
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., sports, outdoor"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.step}>
              <h3>Location & Schedule</h3>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time</label>
                <input 
                  type="time" 
                  value={formData.time} 
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="Where is it happening?"
                />
              </div>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={formData.isOnline} 
                  onChange={e => setFormData({...formData, isOnline: e.target.checked})}
                />
                This is an online activity
              </label>
            </div>
          )}

          {step === 4 && (
            <div className={styles.step}>
              <h3>Participation</h3>
              <div className={styles.formGroup}>
                <label>Total Participants Needed</label>
                <input 
                  type="number" 
                  min="2"
                  value={formData.slotsNeeded} 
                  onChange={e => setFormData({...formData, slotsNeeded: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Join Method</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="participationType"
                      value="open"
                      checked={formData.participationType === 'open'}
                      onChange={e => setFormData({...formData, participationType: e.target.value})}
                    />
                    <span><strong>Open:</strong> Anyone can join instantly</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="participationType"
                      value="approval"
                      checked={formData.participationType === 'approval'}
                      onChange={e => setFormData({...formData, participationType: e.target.value})}
                    />
                    <span><strong>Approval:</strong> You review requests first</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={styles.step}>
              <h3>Review & Publish</h3>
              <div className={styles.reviewCard}>
                <h4>{formData.title || 'Untitled Activity'}</h4>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>When:</strong> {formData.date} at {formData.time}</p>
                <p><strong>Where:</strong> {formData.location}</p>
                <p><strong>Participants:</strong> {formData.slotsNeeded} ({formData.participationType})</p>
              </div>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          {step > 1 ? (
            <button className={styles.backBtn} onClick={handleBack}>Back</button>
          ) : (
            <div /> // placeholder to keep flex alignment
          )}
          
          {step < 5 ? (
            <button 
              className={styles.nextBtn} 
              onClick={handleNext}
              disabled={step === 1 && !formData.category}
            >
              Continue
            </button>
          ) : (
            <button className={styles.publishBtn} onClick={handlePublish}>
              Publish Activity
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
