import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';
import { categoriesList } from '../../data/communities';

export default function CreateCommunityModal({ onClose, onCreated }) {
  const { addCommunity } = useData();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const availableCategories = categoriesList.filter(c => c.id !== 'all' && c.id !== 'colleges');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isDropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim() || !category) {
      showToast('Please fill out all fields');
      return;
    }
    setIsSubmitting(true);
    const id = await addCommunity({
      name,
      desc,
      categoryLabel: categoriesList.find(c => c.id === category)?.label || 'General',
      categories: [category],
    });
    showToast('Community created!');
    onCreated(id);
  };

  const selectedCategoryLabel = availableCategories.find(c => c.id === category)?.label || 'Select category';

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return availableCategories;
    const q = searchQuery.toLowerCase();
    return availableCategories.filter(c => c.label.toLowerCase().includes(q));
  }, [availableCategories, searchQuery]);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', padding: '1rem', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ margin: 'auto', background: 'var(--color-bg-white)', width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-premium)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-family-display)' }}>Create Community</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. React Developers" 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '0.95rem', background: 'var(--color-bg-white)', color: 'var(--color-text-main)' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Description</label>
            <textarea 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="What is this community about?" 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical', background: 'var(--color-bg-white)', color: 'var(--color-text-main)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} ref={dropdownRef}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Category</label>
            
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: `1px solid ${isDropdownOpen ? 'var(--color-primary)' : 'var(--color-border)'}`, 
                  fontFamily: 'inherit', 
                  fontSize: '0.95rem',
                  background: 'var(--color-bg-white)', 
                  color: 'var(--color-text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: isDropdownOpen ? '0 0 0 2px rgba(var(--color-primary-rgb), 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{selectedCategoryLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {isDropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 0.5rem)', 
                  left: 0, 
                  right: 0, 
                  background: 'var(--color-bg-white)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-md)', 
                  boxShadow: 'var(--shadow-premium)', 
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg-main)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.6rem', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-muted)' }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search category..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--color-text-main)' }}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '0.5rem' }}>
                    {filteredCategories.length > 0 ? filteredCategories.map(cat => (
                      <div 
                        key={cat.id} 
                        onClick={() => {
                          setCategory(cat.id);
                          setIsDropdownOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-bg-soft)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = category === cat.id ? 'var(--color-bg-soft)' : 'transparent';
                        }}
                        style={{ 
                          padding: '0.6rem 0.75rem', 
                          cursor: 'pointer',
                          borderRadius: 'var(--radius-sm)',
                          color: category === cat.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                          background: category === cat.id ? 'var(--color-bg-soft)' : 'transparent',
                          fontWeight: category === cat.id ? 600 : 400,
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {cat.label}
                      </div>
                    )) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        No categories found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
